'use strict'

const KeytokenModel = require("../models/keytoken.model")

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = await KeytokenModel.create({
        user: userId,
        publicKey,
        privateKey
      })

      return tokens
    } catch (error) {
      return error
    }
  }
}

module.exports = KeyTokenService
