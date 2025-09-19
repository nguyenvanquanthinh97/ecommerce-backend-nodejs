"use strict";

const {
  ProductSchema,
  ClothingSchema,
  ElectronicSchema,
  FurnitureSchema,
} = require("../models/product.model");

const { BadRequestError } = require("../core/error.response");
const {
  queryProduct,
  publishProductByShop,
  unpublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById
} = require("../models/repositories/product.repo");
const { removeUndefinedDeepObject } = require("../utils");

// define Factory class to create product
class ProductFactory {
  /**
   * type: 'Clothing' | 'Electronics'
   * payload: data
   */
  static productRegistry = {};

  static registerProductType(type, classRef) {
    if (!ProductFactory.productRegistry[type]) {
      ProductFactory.productRegistry[type] = classRef;
    }
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (productClass) {
      return await new productClass(payload).createProduct();
    }
    throw new BadRequestError(`Invalid product type: ${type}`);
  }

  // put ///
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unpublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({
      product_shop,
      product_id,
      unpublish: true,
    });
  }
  // End put

  // patch ///
  static async updateProduct({ type, productId, payload }) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`);

    return new productClass(payload).updateProduct(productId);
  }
  // End patch ///

  // query ///
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await queryProduct({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await queryProduct({ query, limit, skip });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({
      product_id,
      unselect: ["__v", "product_variations"],
    });
  }
  // end query ///
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

  // update Product
  async updateProduct(productId, payload) {
    return await updateProductById({
      productId,
      payload,
      model: ProductSchema
    });
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

  async updateProduct(productId) {
    // 1. remove attr has null undefined
    const objectParams = removeUndefinedDeepObject(this);
    // 2. check where to update (patch mechanism)
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        payload: objectParams.product_attributes,
        model: ClothingSchema
      });
    }
    const updatedProduct = await super.updateProduct(productId, objectParams);

    return updatedProduct;
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

  async updateProduct(productId) {
    // 1. remove attr has null undefined
    const objectParams = removeUndefinedDeepObject(this);
    // 2. check where to update (patch mechanism)
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        payload: objectParams.product_attributes,
        model: ElectronicSchema
      });
    }
    const updatedProduct = await super.updateProduct(productId, objectParams);

    return updatedProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureSchema.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("create new Furniture error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }

  async updateProduct(productId) {
    // 1. remove attr has null undefined
    const objectParams = removeUndefinedDeepObject(this);
    // 2. check where to update (patch mechanism)
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        payload: objectParams.product_attributes,
        model: ElectronicSchema
      });
    }
    const updatedProduct = await super.updateProduct(productId, objectParams);

    return updatedProduct;
  }
}

// register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
