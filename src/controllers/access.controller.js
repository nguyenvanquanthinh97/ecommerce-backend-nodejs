"use strict";

const AccessService = require("../services/access.service");

const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
  login = async (req, res, next) => {
    return new SuccessResponse({
      message: "Login OK!",
      metadata: await AccessService.login(req.body),
    }).send(res)
  };

  signUp = async (req, res, next) => {
    return new CREATED({
      message: "Register OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res)
  };
}

module.exports = new AccessController();
