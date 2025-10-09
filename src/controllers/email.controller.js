"use strict";

const { SuccessResponse } = require("../core/success.response");
const TemplateService = require("../services/template.service");

class EmailController {
  newTemplate = async (req, res, next) => {
    new SuccessResponse({
      message: "new template",
      metadata: await TemplateService.newTemplate(req.body),
    }).send(res);
  };
}

module.exports = new EmailController();
