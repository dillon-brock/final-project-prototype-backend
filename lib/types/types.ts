export interface Teacher {
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
}

export interface TeacherRow {
  id: string;
  user_id: string;
  subject: string;
  bio: string | null;
  zip_code: number;
  phone_number: string | null;
  contact_email: string | null;
  first_name: string;
  last_name: string;
  image_url: string;
  students?: any;
  avg_rating?: number;
  reviews?: Array<Review>;
}

export interface NewTeacherInfo {
  userId: string;
  subject: string;
  bio: string | null;
  zipCode: number;
  phoneNumber: string | null;
  contactEmail: string | null;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export type TeacherDatabaseRows = {
  rows: Array<TeacherRow>
}

export interface Student {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  teachers?: Array<Teacher>
}

export interface StudentRow {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  teachers?: Array<Teacher>
}

export interface NewStudentInfo {
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  type: string;
}

export interface NewUserInfo {
  email: string;
  passwordHash: string;
  type: string;
}

export interface UnhashedUserInfo {
  email: string;
  password: string;
  type: string;
}

export interface UserSignInInfo {
  email: string;
  password: string;
}

export interface ReviewRow {
  id: string;
  stars: string;
  detail: string;
  teacher_id: string;
  student_id: string;
}

export interface NewReviewData {
  stars: string;
  detail: string | null;
  teacherId: string;
  studentId: string | null;
}

export interface Review {
  id: string;
  stars: string;
  detail: string;
  teacherId: string;
  studentId: string;
}

export interface TeacherStudentConnection {
  id: string;
  teacher_id: string;
  student_id: string;
  connection_approved: string;
}

export type TeacherStudentRows = {
  rows: Array<TeacherStudentConnection>
}