require("dotenv").config();
global.APP_ROOT = __dirname;

const express = require("express");
const app = express();

const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { v4: uuid } = require("uuid");
const myLogger = require("./loggers/mylogger.log");

// init middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"];
  req.requestId = requestId || uuid();
  myLogger.log("input params", [
    req.path,
    { requestId: req.requestId },
    req.method === "POST" ? req.body : req.query,
  ]);
  next();
});

// test pub.sub redis service
// require("./tests/inventory.test");
// const productTest = require("./tests/product.test");

// setTimeout(() => {
//   productTest.purchaseProduct('product:001', 10)
// }, 2000)
// init db
require("./dbs/init.mongodb");
const initRedis = require('./dbs/init.redis')
initRedis.initRedis()
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
  const resMessage = `${error.status} - ${
    Date.now() - error.now
  }ms - Response: ${JSON.stringify(error)}`;
  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    {
      message: error.message,
    },
  ]);
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
