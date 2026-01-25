const path = require('path');
const fs = require('fs');

// 환경 변수 확인: PostgreSQL URL이 있으면 PostgreSQL 사용, 없으면 SQLite 사용
// Vercel 환경에서는 항상 PostgreSQL 사용 (서버리스 환경에서는 SQLite 불가)
const isVercel = !!process.env.VERCEL;

// 모든 가능한 환경 변수 이름 확인
const postgresUrl = process.env.POSTGRES_URL 
  || process.env.DATABASE_URL 
  || process.env.POSTGRES_PRISMA_URL
  || process.env.POSTGRES_URL_NON_POOLING
  || process.env.SUPABASE_DB_URL;

const hasPostgresUrl = !!postgresUrl;
const usePostgres = hasPostgresUrl || isVercel;

// 디버깅: 환경 변수 확인
if (isVercel) {
  console.log('🔍 환경 변수 확인:');
  console.log('  - VERCEL:', process.env.VERCEL);
  console.log('  - POSTGRES_URL:', process.env.POSTGRES_URL ? '설정됨' : '없음');
  console.log('  - DATABASE_URL:', process.env.DATABASE_URL ? '설정됨' : '없음');
  console.log('  - POSTGRES_PRISMA_URL:', process.env.POSTGRES_PRISMA_URL ? '설정됨' : '없음');
  console.log('  - hasPostgresUrl:', hasPostgresUrl);
  console.log('  - 모든 환경 변수 키:', Object.keys(process.env).filter(k => 
    k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('SUPABASE')
  ));
}

// Vercel 환경에서 DATABASE_URL이 없으면 명확한 오류 표시
if (isVercel && !hasPostgresUrl) {
  console.error('⚠️ Vercel 환경에서 DATABASE_URL이 설정되지 않았습니다.');
  console.error('Vercel 프로젝트 설정에서 DATABASE_URL 환경 변수를 추가해주세요.');
  console.error('현재 관련 환경 변수:', Object.keys(process.env).filter(k => 
    k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('SUPABASE')
  ));
  
  // 임시로 하드코딩된 연결 문자열 사용 (개발용 - 나중에 제거 필요)
  console.warn('⚠️ 임시로 하드코딩된 연결 문자열을 사용합니다. 프로덕션에서는 환경 변수를 사용해야 합니다.');
  const tempUrl = 'postgresql://postgres.kyqkscsaneprzqnznyzf:Dlguswo86%21%21@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
  // 실제로는 throw하지 않고 임시 URL 사용
  // throw new Error('Vercel 환경에서는 DATABASE_URL 환경 변수가 필수입니다. Vercel 프로젝트 설정에서 DATABASE_URL을 추가해주세요.');
}

let db;
let dbRun, dbGet, dbAll;

if (usePostgres) {
  // PostgreSQL 사용
  const { Pool } = require('pg');
  
  // 연결 문자열 결정 (환경 변수 또는 임시 하드코딩)
  // 환경 변수가 설정되어 있으면 환경 변수 사용 (Connection Pooling 형식)
  // 환경 변수가 없으면 Connection Pooling 형식 사용 (Vercel에서 IPv4 호환)
  // Vercel 환경 변수에 설정된 형식: postgresql://postgres.kyqkscsaneprzqnznyzf:Hyunjae110606@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
  // 비밀번호: Hyunjae110606 (특수문자 없음, URL 인코딩 불필요)
  const connectionString = postgresUrl || (isVercel ? 'postgresql://postgres.kyqkscsaneprzqnznyzf:Hyunjae110606@aws-1-ap-south-1.pooler.supabase.com:6543/postgres' : null);
  
  if (!connectionString) {
    throw new Error('PostgreSQL 연결 문자열이 설정되지 않았습니다.');
  }
  
  const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' || isVercel ? { rejectUnauthorized: false } : false
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
      // PostgreSQL 타입 시스템 오류는 무시 (테이블이 이미 존재하는 경우)
      if (err.code === '23505' && err.message.includes('pg_type_typname_nsp_index')) {
        console.log('테이블이 이미 존재합니다. 초기화를 건너뜁니다.');
        isInitialized = true;
        return;
      }
      console.error('테이블 생성 오류:', err.message);
      throw err;
    }
  }

  // 초기화 보장 함수
  async function ensureInitialized() {
    if (isInitialized) return;
    if (initPromise) {
      await initPromise;
      return;
    }
    
    initPromise = initTables();
    try {
      await initPromise;
    } catch (err) {
      // 초기화 실패 시 promise를 null로 설정하여 재시도 가능하게 함
      initPromise = null;
      console.error('데이터베이스 초기화 실패:', err);
      throw err;
    }
  }

  // 연결 테스트 함수
  async function testConnection() {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch (err) {
      console.error('데이터베이스 연결 테스트 실패:', err);
      return false;
    }
  }

  // 공개 초기화 함수 (서버 시작 시 호출)
  async function initialize() {
    try {
      const connected = await testConnection();
      if (!connected) {
        throw new Error('데이터베이스 연결에 실패했습니다.');
      }
      await ensureInitialized();
      console.log('✅ 데이터베이스 초기화 완료');
      return true;
    } catch (err) {
      console.error('❌ 데이터베이스 초기화 오류:', err);
      throw err;
    }
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
  // Vercel 환경에서는 SQLite 사용 불가 - 이미 위에서 체크했지만 다시 확인
  if (isVercel) {
    throw new Error('SQLite는 Vercel 서버리스 환경에서 사용할 수 없습니다. DATABASE_URL 환경 변수를 설정해주세요.');
  }

  const sqlite3 = require('sqlite3').verbose();

  // 데이터 디렉토리 생성 (로컬 개발 환경에서만)
  // Vercel 환경에서는 절대 실행되지 않아야 함
  const dataDir = path.join(__dirname, '..', 'data');
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch (err) {
    // 로컬 개발 환경이 아닌 경우 (예: 서버리스 환경)
    console.error('데이터 디렉토리 생성 실패:', err.message);
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
  }

  // SQLite 초기화 함수 (Promise 기반)
  async function initialize() {
    return new Promise((resolve, reject) => {
      // SQLite는 연결 시 자동으로 initTables()가 호출되므로
      // 연결이 성공했는지만 확인하면 됨
      db.get('SELECT 1', (err) => {
        if (err) {
          console.error('SQLite 연결 테스트 실패:', err);
          reject(err);
        } else {
          console.log('✅ SQLite 데이터베이스 초기화 완료');
          resolve(true);
        }
      });
    });
  }
}

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll,
  initialize
};
