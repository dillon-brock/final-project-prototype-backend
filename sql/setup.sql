-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS teachers_students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  type TEXT
);

INSERT INTO users (email, password_hash) VALUES
  ('db@test.com', 'fakeHash'),
  ('mo@salad.com', 'fakeHash'),
  ('cat@cat.com', 'catHash'),
  ('hsw@gmail.comm', 'hash'),
  ('beepboop@jlaurent.com', 'fakehash'),
  ('rh@dearrh.com', 'hash');

CREATE TABLE teachers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  subject TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  bio TEXT,
  zip_code INT NOT NULL,
  phone_number TEXT,
  contact_email TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO teachers (user_id, subject, zip_code, first_name, last_name, image_url) VALUES
  (3, 'scratching', 97214, 'Arlop', 'Beans', 'catpics.com'),
  (4, 'Alexander Technique', 97214, 'Helen', 'Spencer-Wallace', 'helen.com'),
  (5, 'ams', 97202, 'Jordan', 'Laurent', 'ams.com'),
  (6, 'Alexander Technique', 48390, 'Rebecca', 'Harrison', 'dearrh.com');

CREATE TABLE students (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  image_url TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO students (user_id, first_name, last_name, image_url) VALUES
  (1, 'Dillon', 'Brock', 'image.com'),
  (2, 'Mo', 'Saladino', 'image.com');

CREATE TABLE teachers_students (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  teacher_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  connection_approved BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO teachers_students (teacher_id, student_id, connection_approved) VALUES
  (1, 1, TRUE),
  (1, 2, TRUE),
  (2, 2, FALSE),
  (3, 1, FALSE),
  (2, 1, TRUE);


CREATE TABLE reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  stars INT NOT NULL,
  detail VARCHAR,
  teacher_id BIGINT NOT NULL,
  student_id BIGINT,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO reviews (stars, teacher_id, student_id) VALUES
  (5, 1, 1),
  (4, 1, 2);