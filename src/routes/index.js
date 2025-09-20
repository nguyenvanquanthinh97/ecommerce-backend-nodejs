"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// check apiKey
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/api/v1/products", require("./product"));
router.use("/api/v1/discount", require("./discount"));
router.use("/api/v1", require("./access"));

// router.get("", (req, res, next) => {
//   return res.status(200).json({
//     message: "Welcome to the API",
//   });
// });

module.exports = router;
