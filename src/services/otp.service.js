"use strict";
const crypto = require("crypto");
const OTPModel = require("../models/otp.model");

class OTPService {
  static generatorTokenRandom = () => {
    const token = crypto.randomInt(0, Math.pow(2, 32));
    return token;
  };

  static newOtp = async ({ email }) => {
    const token = this.generatorTokenRandom();
    const newToken = await OTPModel.create({
      otp_token: token,
      otp_email: email,
    });

    return newToken;
  };
}

module.exports = OTPService;
