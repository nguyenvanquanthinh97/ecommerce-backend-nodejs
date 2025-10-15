"use strict";

const mongoose = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Spu";
const COLLECTION_NAME = "Spus";

// Declare the Schema of the Mongo model
const SpuSchema = new mongoose.Schema(
  {
    product_id: { type: String, dfeault: "" },
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_slug: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_category: { type: Array, required: true },
    product_quantity: {
      type: Number,
      required: true,
    },
    // product_type: {
    //   type: String,
    //   required: true,
    //   enum: ['Electronics', 'Clothing', 'Furniture']
    // },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    /**
     * {
     *  attribute_id: 12345, // style ao [han quoc, thoi trang, mua he]
     *  attribute_values: [
     *  { value_id: 123 },
     * ]
     * }
     */
    product_ratings: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    /*
      tier_variation: [
        {
          images: [],
          name: "color",
          options: ['red', 'green'],
        },
        {
          name: 'size',
          options: ['S', 'M'],
          images: []
        }
      ]
    */
    product_variations: {
      type: Array,
      default: [],
    },
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

// create index for search
SpuSchema.index({ product_name: "text", product_description: "text" });

// Document middleware: runs before .save() and .create()
SpuSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

module.exports = mongoose.model(DOCUMENT_NAME, SpuSchema);
