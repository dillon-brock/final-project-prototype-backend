import { NewReviewData, ReviewRow } from "../types/types";

const pool = require('../utils/pool');

export class Review {
  id: string;
  stars: string;
  detail: string;
  teacherId: string;
  studentId: string;

  constructor(row: ReviewRow) {
    this.id = row.id;
    this.stars = row.stars;
    this.detail = row.detail;
    this.teacherId = row.teacher_id;
    this.studentId = row.student_id;
  }

  static async create({ stars, detail = null, teacherId, studentId = null }: NewReviewData): Promise<Review> {
    const { rows } = await pool.query(
      `INSERT INTO reviews (stars, detail, teacher_id, student_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [stars, detail, teacherId, studentId]
    );

    return new Review(rows[0]);
  }

  static async deleteById(id: string): Promise<Review | null> {
    const { rows } = await pool.query(
      `DELETE FROM reviews
      WHERE id = $1
      RETURNING *`, [id]
    );
    
    if (!rows[0]) return null;
    return new Review(rows[0]);
  }
}
