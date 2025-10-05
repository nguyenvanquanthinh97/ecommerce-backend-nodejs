"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const router = express.Router();

// const { uploadMemory } = require("../../configs/multer.config");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { uploadDisk } = require("../../configs/multer.config");

router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))

// // upload s3
// router.post(
//   "/product/bucket",
//   uploadMemory.single("file"),
//   asyncHandler(uploadController.uploadImageFromLocalS3)
// );

module.exports = router;
