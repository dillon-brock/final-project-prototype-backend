// User Model Types

export interface UserFromDatabase {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  image_url: string;
}

export interface UserFromConstructor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface UserInsertData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

// User Service Types

export interface UserSignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface UserSignInData {
  email: string;
  password: string;
}

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