"use strict";

const { CartModel } = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const updateOrInsert = {
    $addToSet: { cart_products: product },
  };
  const options = { upsert: true, new: true };
  return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
    cart_userId: userId,
    "cart_products.productId": productId,
    cart_state: "active",
  };
  const updateSet = {
    $inc: {
      "cart_products.$.quantity": quantity,
    },
  };
  const options = { new: true, upsert: true };

  return await CartModel.findOneAndUpdate(query, updateSet, options);
};

const findCartById = async (cartId) => {
  return await CartModel.findOne({ _id: cartId, cart_state: "active" });
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
  findCartById
};
