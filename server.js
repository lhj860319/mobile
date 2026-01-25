const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const { initialize } = require('./database/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 초기화 미들웨어 (Vercel 서버리스 환경용)
let dbInitPromise = null;
async function ensureDbInitialized(req, res, next) {
  // PostgreSQL을 사용하는 경우에만 초기화 함수가 있음
  if (initialize) {
    if (!dbInitPromise) {
      dbInitPromise = initialize().catch(err => {
        console.error('데이터베이스 초기화 실패:', err);
        dbInitPromise = null; // 재시도 가능하도록
        throw err;
      });
    }
    try {
      await dbInitPromise;
    } catch (err) {
      return res.status(500).json({ 
        error: '데이터베이스 연결에 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
  next();
}

// 미들웨어 설정
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 제공 (HTML, CSS, JS 등)
app.use(express.static(path.join(__dirname, 'public')));

// API 라우트 (데이터베이스 초기화 보장)
app.use('/api', ensureDbInitialized, apiRoutes);

// 루트 경로는 index.html로 리다이렉트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ error: '요청한 리소스를 찾을 수 없습니다.' });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 오류:', err);
  console.error('오류 메시지:', err.message);
  console.error('오류 스택:', err.stack);
  res.status(500).json({ 
    error: '서버 내부 오류가 발생했습니다.',
    details: process.env.NODE_ENV === 'development' || process.env.VERCEL ? err.message : undefined
  });
});

// Vercel 서버리스 함수로 export (Vercel 배포 시)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
}

// 로컬 개발 환경에서만 서버 시작
if (require.main === module) {
  // 로컬 환경에서는 서버 시작 전에 데이터베이스 초기화
  (async () => {
    try {
      if (initialize) {
        await initialize();
      }
      app.listen(PORT, () => {
        console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
        console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (err) {
      console.error('서버 시작 실패:', err);
      process.exit(1);
    }
  })();
}

