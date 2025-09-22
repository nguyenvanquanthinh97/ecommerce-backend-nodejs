"use strict";

const {
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnselect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const DiscountModel = require("../models/discount.model");
const { findAllProducts } = require("../models/repositories/product.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");

/**
 * Discount Services
 * 1 - Generator Discount Coude (Shop | Admin)
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User | shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [Admin | Shop]
 * 6 - Cancel discount code [User]
 */

class DiscountService {
  // 1 - Generator Discount Coude (Shop | Admin)
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("start_date must be before end_date");
    }

    // create index for discount code
    const foundDiscount = await DiscountModel.findOne({
      discount_code: code,
      discount_shopId: shopId,
    }).lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists");
    }

    const newDiscount = await DiscountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_is_active: is_active,
      discount_shopId: shopId,
      discount_min_order_value: min_order_value,
      discount_product_ids: product_ids,
      discount_applies_to: applies_to,
      discount_max_uses: max_uses,
      discount_max_discount_value: max_value,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  /**
   * Get all discount codes available with products
   */
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create index for discount code
    const foundDiscount = await DiscountModel.findOne({
      discount_code: code,
      discount_shopId: shopId,
    }).lean();
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      // get all products
      products = await findAllProducts({
        filter: { product_shop: shopId, isPublished: true },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      // get the product ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  /**
   * get all discount codes of Shop
   */
  static async getAllDiscountCodesByShop({ shopId, limit, page }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      select: ["discount_code", "discount_name"],
      model: DiscountModel,
    });

    return discounts;
  }

  /**
   * Apply Discount code
   * products = [
   *  {
   *    productId,
   *    shopId,
   *    price,
   *    quantity,
   *    name
   *  }
   * ]
   */
  static async getDiscountAmount({ codeId, userId, shopId, products = [] }) {
    console.log("codeId::", codeId);
    const foundDiscount = await checkDiscountExists(DiscountModel, {
      discount_code: codeId,
    });

    if (!foundDiscount) throw new NotFoundError("Discount code not found");
    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value
    } = foundDiscount

    if (!discount_is_active) throw new BadRequestError("Discount code is expired");
    if (discount_max_uses <= 0) throw new BadRequestError("Discount code has been used up");

    if (new Date() > new Date(discount_end_date)) {
      throw new BadRequestError("Discount code is expired");
    }

    // Check if code have min order value
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((total, product) => total + product.price * product.quantity, totalOrder);
      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(`Order value must be at least ${discount_min_order_value} to use this discount code`);
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = await discount_users_used.find(user => user.userId === userId)
      if (userUserDiscount) {
        // TODO
      }
    }

    // check if discount is fixed_amount or percentage
    const amount = discount_type === 'fixed_amount' ? discount_value : (totalOrder * discount_value) / 100
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({shopId, codeId}) {
    const deleted = await DiscountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: shopId
    }).lean()

    return deleted
  }

  static async cancelDiscountCode({userId, codeId, shopId}){
    const foundDiscount = await checkDiscountExists(DiscountModel, {
      discount_code: codeId,
      discount_shopId: shopId
    }).lean();

    if (!foundDiscount) throw new NotFoundError("Discount code not found");
    const result = await DiscountModel.findByIdAndDelete(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      }
    }).lean()

    return result
  }
}

module.exports = DiscountService;
