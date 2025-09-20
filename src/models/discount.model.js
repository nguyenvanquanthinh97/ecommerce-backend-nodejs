"use strict";
const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
const DiscountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      enum: ["fixed_amount", "percentage"],
      required: true,
      default: "fixed_amount",
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number,
      required: true
    },
    discount_uses_count: {
      type: Number,
      required: true,
    },
    discount_users_used: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      enum: ["all", "specific"],
      required: true,
      default: "all_",
    },
    discount_product_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },
    discount_max_discount_value: {
      type: Number,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, DiscountSchema);
