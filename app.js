const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./src/routes/tours');
const userRouter = require('./src/routes/users');

const {ROUTS} = require('./src/constants');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(ROUTS.tours, tourRouter);
app.use(ROUTS.users, userRouter);

module.exports = app;
