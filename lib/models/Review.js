const pool = require('../utils/pool');

module.exports = class Review {
  id;
  stars;
  detail;
  teacher_id;
  student_id;

  constructor(row) {
    this.id = row.id;
    this.stars = row.stars;
    this.detail = row.detail;
    this.teacher_id = row.teacher_id;
    this.student_id = row.student_id;
  }

  static async create({ stars, detail = null, teacherId, studentId = null }) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (stars, detail, teacher_id, student_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [stars, detail, teacherId, studentId]
    );

    return new Review(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      `DELETE FROM reviews
      WHERE id = $1
      RETURNING *`, [id]
    );
    
    if (!rows[0]) return null;
    return new Review(rows[0]);
  }
};
