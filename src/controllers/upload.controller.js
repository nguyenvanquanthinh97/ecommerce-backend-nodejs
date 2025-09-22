"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");

const { uploadImageFromLocalToS3 } = require("../services/upload.service");

class UploadController {
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
