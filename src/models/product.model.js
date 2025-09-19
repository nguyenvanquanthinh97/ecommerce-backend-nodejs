"use strict";

const mongoose = require("mongoose");
const slugify = require('slugify')

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const ProductSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String
    },
    product_slug: {
      type: String
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    product_ratings: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
      set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
      type: Array,
      default: []
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// create index for search
ProductSchema.index({ product_name: 'text', product_description: 'text' });

// Document middleware: runs before .save() and .create()
ProductSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next();
});

// define the product type = clothing
const ClothingSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  size: String,
  material: String,
  product_shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  }
}, {
  collection: 'Clothes',
  timestamps: true,
})

const FurnitureSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  size: String,
  material: String,
  product_shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  }
}, {
  collection: 'Furnitures',
  timestamps: true,
})

// define the product type = electronics
const ElectronicSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: true,
  },
  model: String,
  color: String,
  product_shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  }
}, {
  collection: 'Electronics',
  timestamps: true,
})

//Export the model
module.exports = {
  ProductSchema: mongoose.model(DOCUMENT_NAME, ProductSchema),
  ClothingSchema: mongoose.model('Clothing', ClothingSchema),
  FurnitureSchema: mongoose.model('Furniture', FurnitureSchema),
  ElectronicSchema: mongoose.model('Electronics', ElectronicSchema)
};
