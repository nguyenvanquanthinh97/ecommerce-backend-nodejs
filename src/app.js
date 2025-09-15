require("dotenv").config();
const express = require("express");
const app = express();

const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

// init middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongodb");
// const { checkOverloadConnect } = require("./helpers/check.connect");
// checkOverloadConnect();

// init routes
app.use("/", require("./routes"));

// handling error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
  });
})

module.exports = app;
