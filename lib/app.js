const express = require('express');
const cookieParser = require('cookie-parser');
import { studentsRouter } from './controllers/students';

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
// App routes
app.use('/api/v1/users', studentsRouter);
app.use('/api/v1/teachers', require('./controllers/teachers.js'));
app.use('/api/v1/students', require('./controllers/students'));
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
