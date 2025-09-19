"use strict";

const {
  ProductSchema,
  ClothingSchema,
  ElectronicSchema,
} = require("../models/product.model");

const { BadRequestError } = require("../core/error.response");

// define Factory class to create product
class ProductFactory {
  /**
   * type: 'Clothing' | 'Electronics'
   * payload: data
   */
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return await new Clothing(payload).createProduct();
      case "Electronics":
        return await new Electronics(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product type: ${type}`);
    }
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(product_id) {
    return await ProductSchema.create({ ...this, _id: product_id });
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingSchema.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new Clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await ElectronicSchema.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("create new Electronics error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}

module.exports = ProductFactory;
