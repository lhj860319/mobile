const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Application = require('../models/application');

// 전체 신청서 목록 조회
router.get('/applications', async (req, res) => {
  try {
    console.log('📋 신청서 목록 조회 시작');
    const applications = await Application.findAll();
    console.log(`✅ 신청서 ${applications.length}개 조회 성공`);
    res.json(applications);
  } catch (error) {
    console.error('❌ 신청서 목록 조회 오류:', error);
    console.error('오류 메시지:', error.message);
    console.error('오류 스택:', error.stack);
    res.status(500).json({ 
      error: '신청서 목록을 불러오는데 실패했습니다.',
      details: process.env.NODE_ENV === 'development' || process.env.VERCEL ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 신청서 상세 조회
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: '신청서를 찾을 수 없습니다.' });
    }
    res.json(application);
  } catch (error) {
    console.error('신청서 조회 오류:', error);
    res.status(500).json({ error: '신청서를 불러오는데 실패했습니다.' });
  }
});

// 신청서 생성
router.post('/applications', async (req, res) => {
  try {
    const { carrier, customerName, phoneNumber, plan, commission, storeName, notes } = req.body;
    
    // 필수 필드 검증
    if (!carrier || !customerName || !phoneNumber) {
      return res.status(400).json({ 
        error: '필수 항목을 모두 입력해주세요. (통신사, 고객명, 연락처)' 
      });
    }

    const application = await Application.create({
      carrier,
      customerName,
      phoneNumber,
      plan: plan || null,
      commission: commission || 0,
      storeName: storeName || null,
      notes: notes || null
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('신청서 생성 오류:', error);
    res.status(500).json({ error: '신청서 저장에 실패했습니다.' });
  }
});

// 신청서 상태 업데이트
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: '상태를 입력해주세요.' });
    }

    const application = await Application.updateStatus(req.params.id, status);
    
    if (!application) {
      return res.status(404).json({ error: '신청서를 찾을 수 없습니다.' });
    }

    res.json(application);
  } catch (error) {
    console.error('상태 업데이트 오류:', error);
    res.status(500).json({ error: '상태 업데이트에 실패했습니다.' });
  }
});

// 신청서 수수료 업데이트
router.patch('/applications/:id/commission', async (req, res) => {
  try {
    const { commission } = req.body;
    
    if (commission === undefined || commission === null) {
      return res.status(400).json({ error: '수수료를 입력해주세요.' });
    }

    const application = await Application.updateCommission(req.params.id, commission);
    
    if (!application) {
      return res.status(404).json({ error: '신청서를 찾을 수 없습니다.' });
    }

    res.json(application);
  } catch (error) {
    console.error('수수료 업데이트 오류:', error);
    res.status(500).json({ error: '수수료 업데이트에 실패했습니다.' });
  }
});

// 통계 정보 조회
router.get('/statistics', async (req, res) => {
  try {
    const allApplications = await Application.findAll();
    const completedThisMonth = await Application.findCompletedThisMonth();
    
    const stats = {
      total: allApplications.length,
      waiting: allApplications.filter(a => a.status === '접수중').length,
      completed: allApplications.filter(a => a.status === '개통완료').length,
      totalCommission: allApplications
        .filter(a => a.status === '개통완료')
        .reduce((sum, a) => sum + (a.commission || 0), 0),
      thisMonthCommission: completedThisMonth
        .reduce((sum, a) => sum + (a.commission || 0), 0),
      thisMonthCount: completedThisMonth.length
    };

    res.json(stats);
  } catch (error) {
    console.error('통계 조회 오류:', error);
    res.status(500).json({ error: '통계 정보를 불러오는데 실패했습니다.' });
  }
});

// Health check 엔드포인트 (Supabase 일시중지 방지용)
router.get('/health', async (req, res) => {
  try {
    // 데이터베이스 연결 확인
    const applications = await Application.findAll();
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      count: applications.length 
    });
  } catch (error) {
    console.error('Health check 오류:', error);
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      error: error.message 
    });
  }
});

// 신청서 양식 PDF 다운로드
router.get('/forms/:formId', (req, res) => {
  try {
    const { formId } = req.params;
    
    // 폼 ID와 파일명 매핑
    const formMapping = {
      'uplus-umobile-adult': 'U+유모바일 가입신청서 (성인 후불).pdf',
      'uplus-umobile-youth': 'U+유모바일 가입신청서 (청소년 후불).pdf',
      'kt-mmobile': 'KTM모바일 가입신청서 (후불).pdf',
      'kt-skylife': 'KT SkyLife 가입신청서 (후불).pdf',
      'sk-7mobile': 'SK 7모바일 가입신청서 (후불).pdf',
      'hello-mobile': 'LG 헬로비젼 가입신청서 (후불).pdf',
      'ins-mobile': '인스모바일 가입신청서 (선불).pdf'
    };

    const fileName = formMapping[formId];
    
    if (!fileName) {
      return res.status(404).json({ error: '신청서 양식을 찾을 수 없습니다.' });
    }

    // PDF 파일 경로
    const formsDir = path.join(__dirname, '..', 'public', 'forms');
    const filePath = path.join(formsDir, fileName);

    // 파일 존재 확인
    if (!fs.existsSync(filePath)) {
      console.error(`PDF 파일을 찾을 수 없습니다: ${filePath}`);
      return res.status(404).json({ 
        error: '신청서 양식 파일을 찾을 수 없습니다.',
        file: fileName
      });
    }

    // 파일 다운로드
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
      console.error('파일 읽기 오류:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: '파일을 읽는 중 오류가 발생했습니다.' });
      }
    });
  } catch (error) {
    console.error('신청서 양식 다운로드 오류:', error);
    res.status(500).json({ error: '신청서 양식 다운로드에 실패했습니다.' });
  }
});

module.exports = router;

