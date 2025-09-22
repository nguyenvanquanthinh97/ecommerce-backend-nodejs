"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductsByServer } = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const { OrderModel } = require("../models/order.model");

class CheckoutService {
  // login and without login

  /**
   *
   * {
   *  cartId,
   *  userId,
   *  shop_orders: [
   *    {
   *      shopId,
   *      shop_discounts: [
   *      {shopId, discountId, codeId}
   *      ],
   *      item_products: [
   *       {
   *          productId,
   *          quantity,
   *          price,
   *        }
   *      ]
   *    }
   *  ]
   * }
   */

  static async checkoutReview({ cartId, userId, shop_orders }) {
    // check cartId if exists
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new NotFoundError(`Not found cart with id ${cartId}`);
    }

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const shop_orders_new = [];

    for (let i = 0; i < shop_orders.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_orders[i];
      // check product available
      const checkProductServer = await checkProductsByServer(item_products);
      if (checkProductServer.length === 0)
        throw new BadRequestError("order wrong!!!");

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        originalPrice: checkoutPrice,
        finalPrice: checkoutPrice,
        item_products: checkProductServer,
      }

      // if shop_discounts -> check valid
      if (shop_discounts.length > 0) {
        // check valid discount
        // Suppose only one discount applied for each shop
        const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        })

        // total discount
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.finalPrice = totalPrice
        }
      }

      checkout_order.totalCheckout += itemCheckout.finalPrice
      shop_orders_new.push(itemCheckout)
    }

    return {
      shop_orders,
      shop_orders_new,
      checkout_order
    }
  }

  // order
  static async orderByUser({
    shop_orders,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const { shop_orders_new, checkout_order } =  await CheckoutService.checkoutReview({
      cartId,
      userId,
      shop_orders: shop_orders
    })

    // check if the quantity in inventory is enough
    const products = shop_orders_new.flatMap(order => order.item_products);
    console.log(`[1]:`, products);
    const acquireProducts = []
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProducts.push( keyLock ? true : false)

      if (keyLock) {
        await releaseLock(keyLock)
      }
    }

    // check if tehre is a product out of stock in inventory
    if (acquireProducts.includes(false)) {
      throw new BadRequestError("There is a product out of stock in your order");
    }

    const newOrder = await OrderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_orders_new,
    })

    // case: insert order successfully -> remove product in the cart
    if (newOrder) {
      // remove product in my cart

    }

    return newOrder;
  }

  /*
    1> Query Orders [Users]
  */
 static async getOrdersByUser() {

 }

 /*
    2> Query Order Using ID [Users]
 */
 static async getOneOrderByUser() {

 }

 /*
    3> Cancel Order [Users]
 */
 static async cancelOrderByUser() {

 }

 /*
    4> Update Order status [Shop | Admin]
 */
 static async updateOrderStatusByShop() {

 }
}

module.exports = CheckoutService;
