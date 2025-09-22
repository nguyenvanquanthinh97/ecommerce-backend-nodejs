"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { CartModel } = require("../models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");

/**
 * Key features: Cart Service
 * - add product to cart [user]
 * - reduce product quantity in cart by one [user]
 * - increase product onetity by One [user]
 * - get art [User]
 * - Delete cart [User]
 * - Delete cart item [User]
 */
class CartService {
  static async addToCart({ userId, product = {} }) {
    // check cart if exists
    const userCart = await CartModel.findOne({
      cart_userId: userId,
      cart_state: "active",
    });

    if (!userCart) {
      // create cart for User
      return await createUserCart({ userId, product });
    }

    // if cart exists, but does not have product
    if (userCart.cart_products.length === 0) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // if cart exists and have product
    // if product is already in cart => update quantity
    if (userCart.cart_products.find((item) => item.productId === product.productId)) {
      return await updateUserCartQuantity({ userId, product });
    }

    // if product not in cart => add to cart
    userCart.cart_products.push(product);
    return await userCart.save();
  }

  // update cart
  /**
   * shop_order_ids: [
   *  { shopId, item_products: [ { productId, old_quantity, quantity, price, shopId } ], version }
   * ]
   */
  static async addToCartV2({ userId, shop_order_ids = {} }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    console.log({ productId, quantity, old_quantity });
    // check product
    const foundProduct = await getProductById({ productId });
    if (!foundProduct) throw new NotFoundError("Product not found");
    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new BadRequestError("Product not belong to shop");
    }

    if (quantity === 0) {
      // delete
    }

    return await updateUserCartQuantity({
      userId,
      product: { productId, quantity: quantity - old_quantity },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const updatedSet = {
      $pull: { cart_products: { productId } },
    };

    const deletedCart = await CartModel.updateOne(query, updatedSet);
    return deletedCart;
  }

  static async getListUserCart({ userId }) {
    return await CartModel.findOne({
      cart_userId: +userId,
      cart_state: "active",
    }).lean();
  }
}

module.exports = CartService;
