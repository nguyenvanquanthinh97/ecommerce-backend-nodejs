"use strict";

const AccessService = require("../services/access.service");

const { CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get token success!",
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res)
  }

  logout = async (req, res, next) => {
    return new SuccessResponse({
      message: "Logout OK!",
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res)
  }

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
