const express = require("express");
const app = express();

const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db

// init routes
app.get("/", (req, res, next) => {
  const strCompress = "hello Factipjs";
  return res
    .status(200)
    .json({
      message: "Welcome to the API",
      metadata: strCompress.repeat(100000),
    });
});

// handling error

module.exports = app;
