"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");

const { uploadImageFromUrl, uploadImageFromLocal, uploadImageFromLocalToS3 } = require("../services/upload.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: 'upload successfully',
      metadata: await uploadImageFromUrl()
    }).send(res)
  }

  uploadFileThumb = async (req, res, next) => {
    const file = req.file;
    console.log('file', file)
    if (!file) {
      throw new BadRequestError('File not found')
    }

    new SuccessResponse({
      message: 'upload successfully',
      metadata: await uploadImageFromLocal({
        path: file.path
      })
    }).send(res)
  }

  uploadImageFromLocalS3 = async (req, res, next) => {
    const { file } = req;

    if (!file) {
      throw new BadRequestError("File missing");
    }

    new SuccessResponse({
      message: "Upload OK",
      metadata: await uploadImageFromLocalToS3({ file }),
    }).send(res);
  };
}

module.exports = new UploadController();
