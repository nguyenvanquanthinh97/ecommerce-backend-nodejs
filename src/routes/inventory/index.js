"use strict";
const express = require("express");
const InventoryController = require("../../controllers/inventory.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post(
  "",
  authentication,
  asyncHandler(InventoryController.addStockToInventory)
);

module.exports = router;
