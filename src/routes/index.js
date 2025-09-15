"use strict";

const express = require("express");
const router = express.Router();

router.use("/api/v1", require("./access"));

// router.get("", (req, res, next) => {
//   return res.status(200).json({
//     message: "Welcome to the API",
//   });
// });

module.exports = router;
