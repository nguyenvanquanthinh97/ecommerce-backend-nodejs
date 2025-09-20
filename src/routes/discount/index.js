'use strict';

const express = require("express");

const DiscountController = require("../../controllers/discount.controller");
const { authentication } = require("../../auth/authUtils");
const {asyncHandler} = require("../../helpers/asyncHandler");

const router = express.Router();

router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodesWithProduct))

router.post('', authentication, asyncHandler(DiscountController.createDiscountCode))
router.get('', authentication, asyncHandler(DiscountController.getAllDiscountCodes))

module.exports = router;
