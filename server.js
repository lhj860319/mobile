const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 제공 (HTML, CSS, JS 등)
app.use(express.static(path.join(__dirname, 'public')));

// API 라우트
app.use('/api', apiRoutes);

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
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

// Vercel 서버리스 함수로 export (Vercel 배포 시)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
}

// 로컬 개발 환경에서만 서버 시작
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
  });
}

