const { dbRun, dbGet, dbAll } = require('../database/db');
const { v4: uuidv4 } = require('uuid');

class Application {
  // 신청서 생성
  static async create(data) {
    const id = uuidv4();
    const { carrier, customerName, phoneNumber, plan, commission, storeName, notes } = data;
    
    // 정산금 기본값 50,000원 (입력값이 없거나 0인 경우)
    const finalCommission = commission && commission > 0 ? commission : 50000;
    
    const sql = `
      INSERT INTO applications (id, carrier, customer_name, phone_number, plan, status, commission, store_name, notes)
      VALUES (?, ?, ?, ?, ?, '접수중', ?, ?, ?)
    `;
    
    await dbRun(sql, [
      id, 
      carrier, 
      customerName, 
      phoneNumber, 
      plan || '', 
      finalCommission,
      storeName || '',
      notes || ''
    ]);
    return this.findById(id);
  }

  // ID로 조회
  static async findById(id) {
    const sql = 'SELECT * FROM applications WHERE id = ?';
    const row = await dbGet(sql, [id]);
    return this.formatRow(row);
  }

  // 전체 목록 조회
  static async findAll() {
    const sql = 'SELECT * FROM applications ORDER BY created_at DESC';
    const rows = await dbAll(sql);
    return rows.map(row => this.formatRow(row));
  }

  // 상태별 조회
  static async findByStatus(status) {
    const sql = 'SELECT * FROM applications WHERE status = ? ORDER BY created_at DESC';
    const rows = await dbAll(sql, [status]);
    return rows.map(row => this.formatRow(row));
  }

  // 이번 달 완료 건 조회
  static async findCompletedThisMonth() {
    const sql = `
      SELECT * FROM applications 
      WHERE status = '개통완료' 
      AND strftime('%Y-%m', updated_at) = strftime('%Y-%m', 'now')
      ORDER BY updated_at DESC
    `;
    const rows = await dbAll(sql);
    return rows.map(row => this.formatRow(row));
  }

  // 상태 업데이트
  static async updateStatus(id, status) {
    const sql = `
      UPDATE applications 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await dbRun(sql, [status, id]);
    return this.findById(id);
  }

  // 수수료 업데이트
  static async updateCommission(id, commission) {
    const sql = `
      UPDATE applications 
      SET commission = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await dbRun(sql, [commission, id]);
    return this.findById(id);
  }

  // 데이터 포맷팅 (DB 컬럼명을 camelCase로 변환)
  static formatRow(row) {
    if (!row) return null;
    return {
      id: row.id,
      carrier: row.carrier,
      customerName: row.customer_name,
      phoneNumber: row.phone_number,
      plan: row.plan,
      status: row.status,
      commission: row.commission || 50000,
      storeName: row.store_name || '',
      notes: row.notes || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = Application;

