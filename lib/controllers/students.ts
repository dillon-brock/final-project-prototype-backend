// const { Router, Request, Response } = require('express');
import { Router, type Request, type Response} from 'express';
import { Student } from '../models/Student';
import { UserService } from '../services/UserService';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

export const studentsRouter = Router();

studentsRouter
  .post('/', async (req: Request, res: Response, next: (e?: any) => any) => {
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
  .get('/:id/teachers', async (req: Request, res: Response, next) => {
    try {
      if (req.params.id) {
        const student = await Student.findById(req.params.id);
        if (student) {
          const teachers = await student.getTeachers();
          res.json(teachers);
      }
      } else {
        res.json(null);
      }
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
  })
  .post('/:id/teachers', async (req, res, next) => {
    try {
      if (req.params.id) {
        const student = await Student.findById(req.params.id);
        if (student) {
          const connection = await student.addTeacherById(req.body.teacherId);
          res.json(connection);
        }
        else {
          res.json(null);
        }
      }
    } catch (e) {
      next(e);
    }
  });
