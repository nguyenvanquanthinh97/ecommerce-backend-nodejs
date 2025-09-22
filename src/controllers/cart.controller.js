'use strict';

const CartService = require("../services/cart.service");
const { SuccessResponse } = require("../core/success.response");

class CartController {
  /**
   * @desc add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url /v1/api/cart/user
   */
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add to cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Update cart success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  }

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete cart success",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  }

  list = async (req, res, next) => {
    new SuccessResponse({
      message: "Get user cart success",
      metadata: await CartService.getListUserCart({ userId: req.query.userId }),
    }).send(res);
  }
}

module.exports = new CartController();
