'use strict';

const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  newUser = async (req, res, next) => {
    const response = await UserService.newUser({
      email: req.body.email,
    })
    new SuccessResponse(response).send(res);
  }

  checkRegisterEmailToken = async () => {

  }
}

module.exports = new UserController();
