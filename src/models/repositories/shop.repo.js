'use strict';

const ShopModel = require('../shop.model');

const defaultSelect = {
  email: 1, name: 1, status: 1, roles: 1
}
const findShopById = async ({
  shop_id,
  select=defaultSelect
}) => {
  return await ShopModel.findById(shop_id).select(select).lean();
}

module.exports = {
  findShopById
}
