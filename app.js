const express = require("express");
const morgan = require("morgan");

const { NODE_ENV } = process.env;

const tourRouter = require("./src/routes/tours");
const userRouter = require("./src/routes/users");

const { ROUTS } = require("./src/constants");

const app = express();

if (NODE_ENV === "DEV") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(ROUTS.tours, tourRouter);
app.use(ROUTS.users, userRouter);

module.exports = app;
