"use strict";

const KeytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    const filter = { user: userId }
    const  update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken }
    const  options = { upsert: true, new: true }

    const tokens = await KeytokenModel.findOneAndUpdate(filter, update, options)
    return tokens ? tokens.publicKey : null;
  };
}

module.exports = KeyTokenService;
