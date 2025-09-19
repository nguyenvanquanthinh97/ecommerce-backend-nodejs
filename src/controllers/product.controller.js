"use strict";

const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");
const { getInfoData } = require("../utils");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new product success",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.keyStore.user._id,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product success",
      metadata: await ProductService.updateProduct({
        type: req.body.product_type,
        productId: req.params.id,
        payload: {
          ...req.body,
          product_shop: req.keyStore.user._id,
        },
      }),
    }).send(res);
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product success",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.keyStore.user._id,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish product success",
      metadata: await ProductService.unpublishProductByShop({
        product_shop: req.keyStore.user._id,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  // QUERY //
  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list of drafts for shop success",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.keyStore.user._id,
        limit: req.query.limit,
        skip: req.query.skip,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list of published products for shop success",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.keyStore.user._id,
        limit: req.query.limit,
        skip: req.query.skip,
      }),
    }).send(res);
  };

  getListSearchProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list of search products success",
      metadata: await ProductService.searchProducts({
        keySearch: req.query.q,
      }),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list of products success",
      metadata: await ProductService.findAllProducts(
        getInfoData({
          fields: ["limit", "sort", "page", "select"],
          object: req.query,
        })
      ),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product success",
      metadata: await ProductService.findProduct({
        product_id: req.params.id,
      }),
    }).send(res);
  };
  // END QUERY //
}

module.exports = new ProductController();
