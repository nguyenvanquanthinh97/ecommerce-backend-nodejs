"use strict";

const ShopModel = require("../models/shop.model");

const findByEmail = async ({
  email,
  select = {
    email: 1,
    name: 1,
    status: 1,
    roles: 1,
    password: 1,
  },
}) => {
  return await ShopModel.findOne({ email }).select(select).lean();
};

module.exports = {
  findByEmail
}
