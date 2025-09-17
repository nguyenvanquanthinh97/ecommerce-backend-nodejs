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

  static findByUserId = async (userId) => {
    console.log('userId', userId);
    return await KeytokenModel.findOne({ user: userId }).lean();
  }

  static removeKeyById = async (id) => {
    return await KeytokenModel.deleteOne({ _id: id });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await KeytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
  }

  static findByRefreshToken = async (refreshToken) => {
    return await KeytokenModel.findOne({ refreshToken });
  }

  static deleteByUserId = async (userId) => {
    return await KeytokenModel.findOneAndDelete({ user: userId });
  }
}

module.exports = KeyTokenService;
