// Vercel 서버리스 함수로 Express 앱 export
const app = require('../server');

// Vercel은 Express 앱을 자동으로 래핑하지만, 명시적으로 export
module.exports = app;

