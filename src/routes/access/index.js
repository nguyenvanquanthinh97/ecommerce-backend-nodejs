"use strict";

const express = require("express");
const router = express.Router();

const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require('../../auth/authUtils')

// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

// need authentication
router.post('/shop/logout', authentication, asyncHandler(accessController.logout));
router.post('/shop/refresh-token', asyncHandler(accessController.handleRefreshToken));

module.exports = router;
