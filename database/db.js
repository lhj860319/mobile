const path = require('path');
const fs = require('fs');

// 환경 변수 확인: PostgreSQL URL이 있으면 PostgreSQL 사용, 없으면 SQLite 사용
// Vercel 환경에서는 항상 PostgreSQL 사용 (서버리스 환경에서는 SQLite 불가)
const usePostgres = !!(process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.VERCEL);

// Vercel 환경에서 DATABASE_URL이 없으면 명확한 오류 표시
if (process.env.VERCEL && !process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
  console.error('⚠️ Vercel 환경에서 DATABASE_URL이 설정되지 않았습니다.');
  console.error('Vercel 프로젝트 설정에서 DATABASE_URL 환경 변수를 추가해주세요.');
}

let db;
let dbRun, dbGet, dbAll;

if (usePostgres) {
  // PostgreSQL 사용
  const { Pool } = require('pg');
  
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  // 초기화 플래그
  let isInitialized = false;
  let initPromise = null;

  db = pool;

  // SQLite ? 플레이스홀더를 PostgreSQL $1, $2 형식으로 변환
  function convertSqlToPostgres(sql) {
    let paramIndex = 1;
    return sql.replace(/\?/g, () => `$${paramIndex++}`);
  }

  // Promise 래퍼 함수들 (PostgreSQL)
  dbRun = async (sql, params = []) => {
    try {
      await ensureInitialized();
      const pgSql = convertSqlToPostgres(sql);
      const result = await pool.query(pgSql, params);
      return { id: result.insertId, changes: result.rowCount };
    } catch (err) {
      console.error('dbRun 오류:', err);
      throw err;
    }
  };

  dbGet = async (sql, params = []) => {
    try {
      await ensureInitialized();
      const pgSql = convertSqlToPostgres(sql);
      const result = await pool.query(pgSql, params);
      return result.rows[0] || null;
    } catch (err) {
      console.error('dbGet 오류:', err);
      throw err;
    }
  };

  dbAll = async (sql, params = []) => {
    try {
      await ensureInitialized();
      const pgSql = convertSqlToPostgres(sql);
      const result = await pool.query(pgSql, params);
      return result.rows;
    } catch (err) {
      console.error('dbAll 오류:', err);
      throw err;
    }
  };

  // 테이블 초기화 (PostgreSQL) - 지연 초기화
  async function initTables() {
    if (isInitialized) return;
    
    try {
      // 가입 신청서 테이블
      await pool.query(`
        CREATE TABLE IF NOT EXISTS applications (
          id VARCHAR(255) PRIMARY KEY,
          carrier VARCHAR(255) NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(255) NOT NULL,
          plan VARCHAR(255),
          status VARCHAR(255) DEFAULT '접수중',
          commission INTEGER DEFAULT 50000,
          store_name VARCHAR(255),
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('applications 테이블이 준비되었습니다.');

      // 컬럼 추가 (마이그레이션)
      await addMissingColumns();

      // 사용자 테이블
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          role VARCHAR(255) DEFAULT 'partner',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('users 테이블이 준비되었습니다.');
      
      isInitialized = true;
    } catch (err) {
      console.error('테이블 생성 오류:', err.message);
      throw err;
    }
  }

  // 초기화 보장 함수
  async function ensureInitialized() {
    if (isInitialized) return;
    if (initPromise) return initPromise;
    
    initPromise = initTables();
    await initPromise;
  }

  async function addMissingColumns() {
    try {
      // notes 컬럼 확인 및 추가
      const tableInfo = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'applications'
      `);
      const columnNames = tableInfo.rows.map(col => col.column_name);

      if (!columnNames.includes('notes')) {
        await pool.query('ALTER TABLE applications ADD COLUMN notes TEXT');
        console.log('notes 컬럼이 추가되었습니다.');
      }

      if (!columnNames.includes('store_name')) {
        await pool.query('ALTER TABLE applications ADD COLUMN store_name VARCHAR(255)');
        console.log('store_name 컬럼이 추가되었습니다.');
      }
    } catch (err) {
      console.error('컬럼 추가 오류:', err.message);
    }
  }

} else {
  // SQLite 사용 (로컬 개발)
  // Vercel 환경에서는 SQLite 사용 불가
  if (process.env.VERCEL) {
    throw new Error('SQLite는 Vercel 서버리스 환경에서 사용할 수 없습니다. DATABASE_URL 환경 변수를 설정해주세요.');
  }

  const sqlite3 = require('sqlite3').verbose();

  // 데이터 디렉토리 생성 (로컬 개발 환경에서만)
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch (err) {
    console.error('데이터 디렉토리 생성 실패 (로컬 개발 환경이 아닐 수 있음):', err.message);
    throw new Error('SQLite는 로컬 개발 환경에서만 사용할 수 있습니다. DATABASE_URL 환경 변수를 설정해주세요.');
  }

  const dbPath = path.join(dataDir, 'mobile.db');

  // 데이터베이스 연결
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('데이터베이스 연결 오류:', err.message);
    } else {
      console.log('SQLite 데이터베이스에 연결되었습니다.');
      initTables();
    }
  });

  // 테이블 초기화 (SQLite)
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
        addMissingColumns();
      }
    });

    // 사용자 테이블
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
      
      if (!columnNames.includes('notes')) {
        db.run("ALTER TABLE applications ADD COLUMN notes TEXT", (err) => {
          if (err) {
            console.error('notes 컬럼 추가 오류:', err.message);
          } else {
            console.log('notes 컬럼이 추가되었습니다.');
          }
        });
      }
      
      if (!columnNames.includes('store_name')) {
        db.run("ALTER TABLE applications ADD COLUMN store_name TEXT", (err) => {
          if (err) {
            console.error('store_name 컬럼 추가 오류:', err.message);
          } else {
            console.log('store_name 컬럼이 추가되었습니다.');
          }
        });
      }
    });
  }

  // Promise 래퍼 함수들 (SQLite)
  dbRun = (sql, params = []) => {
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

  dbGet = (sql, params = []) => {
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

  dbAll = (sql, params = []) => {
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
}

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll
};
