'use strict';

const { BadRequestError } = require('../core/error.response');
const { SuccessReponse } = require('../core/success.response');
const UserModel = require('../models/user.model');
const EmailService = require('./email.service');

class UserService {
  static newUser = async ({
    email = null,
    captcha = null,
  }) => {
    // 1. check email exists in dbs
    const user = await UserModel.findOne({ usr_email: email }).lean();

    // 2. if exists
    if (user) {
      throw new BadRequestError('Email already exists')
    }

    // 3. Send token via email user
    const result = await EmailService.sendEmailToken({
      email
    })

    return {
      message: 'Verify email user',
      metadata: {
        token: result
      }
    }
  }
}

module.exports = UserService;
