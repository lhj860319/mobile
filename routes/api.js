const express = require('express');
const router = express.Router();
const Application = require('../models/application');

// 전체 신청서 목록 조회
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.findAll();
    res.json(applications);
  } catch (error) {
    console.error('신청서 목록 조회 오류:', error);
    res.status(500).json({ error: '신청서 목록을 불러오는데 실패했습니다.' });
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

module.exports = router;

