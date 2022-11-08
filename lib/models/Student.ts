import { NewStudentInfo, StudentRow, Teacher } from "../types/types";

const pool = require('../utils/pool');

export class Student {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  teachers?: Array<Teacher>

  constructor(row: StudentRow) {
    this.id = row.id;
    this.userId = row.user_id;
    this.firstName = row.first_name;
    this.lastName = row.last_name;
    this.imageUrl = row.image_url;
    if (row.teachers) this.teachers = row.teachers.length ? row.teachers : [];
  }

  static async create({ userId, firstName, lastName, imageUrl }: NewStudentInfo): Promise<Student> {
    const { rows } = await pool.query(
      `INSERT INTO students (user_id, first_name, last_name, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [userId, firstName, lastName, imageUrl]
    );

    return new Student(rows[0]);
  } 

  static async findById(id: string): Promise<Student | null> {
    const { rows } = await pool.query(
      `SELECT * FROM students
      WHERE students.id = $1`, [id]
    );

    if (!rows[0]) return null;
    return new Student(rows[0]);
  }

  static async findByUserId(userId: string): Promise<Student | null> {
    const { rows } = await pool.query(
      `SELECT * FROM students
      WHERE user_id = $1`,
      [userId]
    );

    if (!rows[0]) return null;
    return new Student(rows[0]);
  }

  async getTeachers(): Promise<Student> {
    const { rows } = await pool.query(
      `SELECT students.id,
      COALESCE(
        json_agg(json_build_object('id', teachers.id, 'first_name', teachers.first_name, 'last_name', teachers.last_name, 'image_url', teachers.image_url, 'connection_approved', teachers_students.connection_approved))
        FILTER (WHERE teachers.id IS NOT NULL), '[]'
        ) as teachers from students
        INNER JOIN teachers_students ON students.id = teachers_students.teacher_id
        INNER JOIN teachers ON teachers.id = teachers_students.teacher_id
        WHERE students.id = $1
        GROUP BY students.id`,
      [this.id]
    );

    return new Student(rows[0]);
  }
}
