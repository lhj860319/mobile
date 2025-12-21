const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 데이터 디렉토리 생성
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'mobile.db');

// 데이터베이스 연결
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err.message);
  } else {
    console.log('SQLite 데이터베이스에 연결되었습니다.');
    initTables();
  }
});

// 테이블 초기화
function initTables() {
  // 가입 신청서 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      carrier TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      plan TEXT,
      status TEXT DEFAULT '접수중',
      commission INTEGER DEFAULT 50000,
      store_name TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('테이블 생성 오류:', err.message);
    } else {
      console.log('applications 테이블이 준비되었습니다.');
      // 기존 테이블에 컬럼 추가 (마이그레이션)
      addMissingColumns();
    }
  });

  // 사용자 테이블 (나중에 가입/관리 기능용)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'partner',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('users 테이블 생성 오류:', err.message);
    } else {
      console.log('users 테이블이 준비되었습니다.');
    }
  });
}

// 누락된 컬럼 추가 (마이그레이션)
function addMissingColumns() {
  db.all("PRAGMA table_info(applications)", (err, columns) => {
    if (err) {
      console.error('테이블 정보 조회 오류:', err.message);
      return;
    }
    
    const columnNames = columns.map(col => col.name);
    
    // notes 컬럼 추가
    if (!columnNames.includes('notes')) {
      db.run("ALTER TABLE applications ADD COLUMN notes TEXT", (err) => {
        if (err) {
          console.error('notes 컬럼 추가 오류:', err.message);
        } else {
          console.log('notes 컬럼이 추가되었습니다.');
        }
      });
    }
    
    // store_name 컬럼 추가
    if (!columnNames.includes('store_name')) {
      db.run("ALTER TABLE applications ADD COLUMN store_name TEXT", (err) => {
        if (err) {
          console.error('store_name 컬럼 추가 오류:', err.message);
        } else {
          console.log('store_name 컬럼이 추가되었습니다.');
        }
      });
    }
    
    // commission 기본값 업데이트 (기존 0인 경우 50000으로 변경하지 않음 - 새로 생성되는 것만 50000)
    // 기존 데이터는 그대로 유지
  });
}

// Promise 래퍼 함수들
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll
};

