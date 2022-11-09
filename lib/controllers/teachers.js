const { Router } = require('express');
// const authenticate = require('../middleware/authenticate');
import { Teacher } from '../models/Teacher';
import { UserService } from '../services/UserService';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        imageUrl,
        subject,
        bio,
        zipCode,
        phoneNumber,
        contactEmail
      } = req.body;
      const newUser = await UserService.create({ email, password, type: 'teacher' });
      await Teacher.create({ userId: newUser.id, subject, bio, zipCode, phoneNumber, contactEmail, firstName, lastName, imageUrl });
      const sessionToken = await UserService.signIn({ email, password });
      
      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIES === 'true',
          sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully!' });
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const teachers = await Teacher.findAll(req.query['subject']);
      res.json(teachers);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const teacher = await Teacher.findById(req.params.id);
      res.json(teacher);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id/students', async (req, res, next) => {
    try {
      const teacher = await Teacher.findById(req.params.id);
      const teacherWithStudents = await teacher.getStudents();
      res.json(teacherWithStudents.students);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id/reviews', async (req, res, next) => {
    try {
      const teacher = await Teacher.findById(req.params.id);
      const teacherWithReviews = await teacher.getReviews();
      res.json(teacherWithReviews.reviews);
    } catch (e) {
      next(e);
    }
  });

