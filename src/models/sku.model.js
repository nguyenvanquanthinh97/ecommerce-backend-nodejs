"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "Sku";
const COLLECTION_NAME = "Skus";

// Declare the Schema of the Mongo model
const SkuSchema = new mongoose.Schema(
  {
    sku_id: { type: String, required: true, unique: true },
    sku_tier_idx: { type: Array, default: [0] },
    /**
     * color = [red, green] = [0, 1]
     * size = [S, M] = [0, 1]
     *
     * => red + S = [0, 0]
     * => red + M = [0, 1]
     */

    sku_default: { type: Boolean, default: false },
    sku_slug: {},
    sku_sort: { type: Number, default: 0 },
    sku_price: { type: String, required: true },
    sku_stock: { type: Number, default: 0 }, // array in stock
    product_id: { type: String, required: true }, // ref to spu product

    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, SkuSchema);
