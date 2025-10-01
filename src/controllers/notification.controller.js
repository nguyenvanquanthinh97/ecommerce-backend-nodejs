"use strict";
const { SuccessResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
  async listNotiByUser(req, res, next) {
    new SuccessResponse({
      message: "list notifications by user",
      metadata: await NotificationService.listNotiByUser(req.query),
    }).send(res);
  }
}

module.exports = new NotificationController();
