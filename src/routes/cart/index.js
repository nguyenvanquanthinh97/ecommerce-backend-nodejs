'use strict';

const express = require("express");

const CartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post('', authentication, asyncHandler(CartController.addToCart));
router.delete('', authentication, asyncHandler(CartController.delete));
router.post('/update', authentication, asyncHandler(CartController.update));
router.get('', authentication, asyncHandler(CartController.list))

module.exports = router
