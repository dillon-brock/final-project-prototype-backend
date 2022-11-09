import { NewTeacherInfo, Review, TeacherDatabaseRows, TeacherRow } from "../types/types";
import { Student } from "./Student";

const pool = require('../utils/pool');

export class Teacher {
  id: string;
  userId: string;
  subject: string;
  bio: string | null;
  zipCode: number;
  phoneNumber: string | null;
  contactEmail: string | null;
  students?: Array<Student>;
  firstName: string;
  lastName: string;
  imageUrl: string;
  avgRating?: number;
  reviews?: Array<Review>;

  constructor({ id, user_id, subject, bio, zip_code, phone_number, contact_email, first_name, last_name, image_url, students, avg_rating, reviews }: TeacherRow) {
    this.id = id;
    this.userId = user_id;
    this.subject = subject;
    this.bio = bio;
    this.zipCode = zip_code;
    this.phoneNumber = phone_number;
    this.contactEmail = contact_email;
    this.firstName = first_name;
    this.lastName = last_name;
    this.imageUrl = image_url;
    if (students) this.students = students.length ? students : [];
    if (avg_rating) this.avgRating = avg_rating;
    if (reviews) this.reviews = reviews;
  }

  static async create({ userId, subject, bio = null, zipCode, phoneNumber = null, contactEmail = null, firstName, lastName, imageUrl }: NewTeacherInfo): Promise<Teacher | null> {
    const { rows }: TeacherDatabaseRows = await pool.query(
      `INSERT INTO teachers (user_id, subject, bio, zip_code, phone_number, contact_email, first_name, last_name, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [userId, subject, bio, zipCode, phoneNumber, contactEmail, firstName, lastName, imageUrl]
    );
    
    if (!rows[0]) return null;
    return new Teacher(rows[0]);
  }

  static async findAll(subject: string = ''): Promise<Teacher> {
    subject = `${subject}%`
    const { rows } = await pool.query(
      `SELECT * FROM teachers
      WHERE subject ILIKE $1`,
      [subject]
    );

    return rows.map((row: TeacherRow) => new Teacher(row));
  }

  static async findById(id: string): Promise<Teacher | null> {
    const { rows }: TeacherDatabaseRows = await pool.query(
      `SELECT AVG(reviews.stars) as avg_rating, teachers.* FROM teachers
      LEFT JOIN reviews ON reviews.teacher_id = teachers.id
      WHERE teachers.id = $1
      GROUP BY teachers.id
      `, [id]
    );

    if (!rows[0]) return null;

    return new Teacher(rows[0]);
  }

  static async findByUserId(userId: string): Promise<Teacher | null> {
    const { rows }: TeacherDatabaseRows = await pool.query(
      `SELECT * FROM teachers
      WHERE user_id = $1`, [userId]
    );

    if (!rows[0]) return null;
    return new Teacher(rows[0]);
  }
  
  static async findByStudentId(studentId: string): Promise<Teacher | null> {
    const { rows } = await pool.query(
      `SELECT teachers.* from teachers
      INNER JOIN teachers_students ON teachers.id = teachers_students.teacher_id
      WHERE student_id = $1`, [studentId]
    );
    if (!rows[0]) return null;
    return rows.map((row: TeacherRow) => new Teacher(row));
  }

  async getStudents(): Promise<Teacher | null> {

    const { rows }: TeacherDatabaseRows = await pool.query(
      `SELECT teachers.id,
      COALESCE(
        json_agg(json_build_object('id', students.id, 'first_name', students.first_name, 'last_name', students.last_name, 'image_url', students.image_url, 'connection_approved', teachers_students.connection_approved))
        FILTER (WHERE students.id IS NOT NULL), '[]'
        ) as students from teachers
        INNER JOIN teachers_students ON teachers.id = teachers_students.teacher_id
        INNER JOIN students ON students.id = teachers_students.student_id
        WHERE teachers.id = $1
        GROUP BY teachers.id`,
      [this.id]
    );

    if (!rows[0]) return null;
    return new Teacher(rows[0]);
  }

  async getReviews(): Promise<Teacher | null> {

    const { rows }: TeacherDatabaseRows = await pool.query(
      `SELECT teachers.id,
      COALESCE(
        json_agg(json_build_object('id', reviews.id, 'stars', reviews.stars, 'detail', reviews.detail, 'teacher_id', reviews.teacher_id, 'student_id', reviews.student_id))
        FILTER (WHERE reviews.id IS NOT NULL), '[]'
        ) as reviews from teachers
        INNER JOIN reviews ON teachers.id = reviews.teacher_id
        WHERE teachers.id = $1
        GROUP BY teachers.id`,
      [this.id]
    );

    if (!rows[0]) return null;
    return new Teacher(rows[0]);
  }
};