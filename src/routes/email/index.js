'use strict';

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const emailController = require("../../controllers/email.controller");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post("/new_template", authentication, asyncHandler(emailController.newTemplate))

module.exports = router;
