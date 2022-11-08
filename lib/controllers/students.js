const { Router } = require('express');
import { Student } from '../models/Student';
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
        imageUrl
      } = req.body;
      const newUser = await UserService.create({ email, password, type: 'student' });
      await Student.create({ userId: newUser.id, firstName, lastName, imageUrl });
      const sessionToken = await UserService.signIn({ email, password });

      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIES === 'true',
          sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully!' });
    } catch (e) {
      next(e);
    }
  })
  .get('/:id/teachers', async (req, res, next) => {
    try {
      const student = await Student.findById(req.params.id);
      const teachers = await student.getTeachers();
      res.json(teachers);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const student = await Student.findById(req.params.id);
      res.json(student);
    } catch (e) {
      next(e);
    }
  });
