"use strict";

const {
  ProductSchema,
  ElectronicSchema,
  ClothingSchema,
  FurnitureSchema,
} = require("../../models/product.model");

const { getSelectData, getUnselectData } = require("../../utils");

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await ProductSchema.findOne({
    product_shop,
    _id: product_id,
  });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const wasModified = foundShop.isModified();
  await foundShop.save();
  return wasModified;
};

const unpublishProductByShop = async ({
  product_shop,
  product_id,
  unpublish = true,
}) => {
  const foundShop = await ProductSchema.findOne({
    product_shop,
    _id: product_id,
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const wasModified = foundShop.isModified();
  await foundShop.save();
  return wasModified;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await ProductSchema.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProduct = async ({ product_id, unselect }) => {
  return await ProductSchema.findById(product_id)
    .select(getUnselectData(unselect))
    .lean();
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await ProductSchema.find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch, "i");
  const results = await ProductSchema.find(
    {
      $text: { $search: regexSearch },
      isPublished: true,
    },
    {
      score: { $meta: "textScore" },
    }
  )
    .populate("product_shop", "name email -_id")
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const getProductById = async ({ productId }) => {
  return await ProductSchema.findById(productId).lean();
};

const checkProductsByServer = async (products) => {
  const foundProducts = await Promise.all(
    products.map(async (product) => {
      const foundProduct = await ProductSchema.findById(
        product.productId
      ).lean();
      if (!foundProduct) {
        return undefined
      }

      return {
        productId: product.productId,
        quantity: product.quantity,
        price: foundProduct.product_price,
      };
    })
  );

  return foundProducts.filter((prod) => prod != undefined);
};

module.exports = {
  searchProductByUser,
  queryProduct,
  publishProductByShop,
  unpublishProductByShop,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductsByServer
};
