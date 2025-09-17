"use strict";

const JWT = require("jsonwebtoken");

const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  // accessToken
  const accessToken = await JWT.sign(payload, publicKey, {
    expiresIn: "2 days",
  });

  const refreshToken = await JWT.sign(payload, privateKey, {
    expiresIn: "7 days",
  });

  //
  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) {
      console.log("Error verify:::", err);
    } else {
      console.log("Decode verify:::", decode);
    }
  });

  return { accessToken, refreshToken };
};

const authentication = asyncHandler(async(req, res, next) => {
  /**
   * 1 - Check userId is missing
   * 2 - get accessToken
   * 3 - verify token
   * 4 - check user in db
   * 5 - check keyStore with this userId ?
   * 6 - OK all => return next()
   */
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid request')

  // 2
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore')
  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid request')

  const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
  if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')
  req.keyStore = keyStore;
  return next()
})

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
};
