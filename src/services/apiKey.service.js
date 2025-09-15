'use strict'

const ApikeyModel = require("../models/apikey.model")

const findByKey = async (key) => {
  const objKey = await ApikeyModel.findOne({ key, status: true }).lean();
  return objKey;
}

module.exports = {
  findByKey
}
