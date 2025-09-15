"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
    1 - check email in dbs
    2 - match password
    3 - create accessToken, refreshToken and save
    4 - generate tokens
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null}) => {
    // 1.
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Error: Shop not registered");

    // 2.
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Error: Authentication error");

    // 3.
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // 4 - generate tokens
    const tokens = await createTokenPair(
      { userId: foundShop.id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop.id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })
    return {
        shop: getInfoData({
          fields: ["id", "name", "email", "roles"],
          object: foundShop,
        }),
        tokens,
    };
  }

  static signUp = async ({ name, email, password }) => {
    // step1: check email exists ??
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // created privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey }); // save collection KeyStore


      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop.id, email },
        publicKey,
        privateKey
      );

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop.id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken
      });

      if (!keyStore) {
        throw new BadRequestError("Error: KeyStore error");
      }

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["id", "name", "email", "roles"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
