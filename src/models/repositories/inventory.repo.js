"use strict";

const { InventoryModel } = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await InventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

module.exports = {
  insertInventory,
};
