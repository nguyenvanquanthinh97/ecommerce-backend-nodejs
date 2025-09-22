"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const router = express.Router();

const { uploadMemory } = require("../../configs/multer.config");
const { asyncHandler } = require("../../helpers/asyncHandler");

// upload s3
router.post(
  "/product/bucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadImageFromLocalS3)
);

module.exports = router;
