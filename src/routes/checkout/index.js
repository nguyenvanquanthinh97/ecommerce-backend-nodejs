"use strict";
const express = require("express");

const CheckoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");
const checkoutController = require("../../controllers/checkout.controller");

const router = express.Router();

router.post('/review', asyncHandler(checkoutController.checkoutReview));

module.exports = router;
