'use strict';

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const userController = require("../../controllers/user.controller");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post("/new_user", authentication, asyncHandler(userController.newUser))

module.exports = router;
