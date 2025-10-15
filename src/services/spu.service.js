"use strict";

const _ = require("lodash");
const { findShopById } = require("../models/repositories/shop.repo");
const { NotFoundError } = require("../core/error.response");
const SpuModel = require("../models/spu.model");
const { randomProductId } = require("../utils");
const { newSku, allSkuBySpuId } = require("./sku.service");

const newSpu = async ({
  product_id,
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variations,
  sku_list = [],
}) => {
  try {
    // 1. Check if Shop exists
    const foundShop = await findShopById({
      shop_id: product_shop,
    });

    if (!foundShop) throw new NotFoundError("Shop not found");

    // 2. Create a new SPU
    const spu = await SpuModel.create({
      product_id: randomProductId(),
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variations,
    });

    // get spu_id add to sku.service
    if (spu && sku_list.length > 0) {
      console.log('SPU created. Now create SKUs...');
      // 3. create skus
      await newSku(
        {
          sku_list,
          spu_id: spu.product_id,
        }
      ).then();
    }

    // 4. sync data via elasticsearch (search.service)

    // 5. respond research object

    return !!spu;
  } catch (error) {}
};

const oneSpu = async ({ spu_id}) => {
  try {
    const spu = await SpuModel.findOne({
      product_id: spu_id,
      isPublished: false,
    }).lean()

    if (!spu) throw new NotFoundError('SPU not found')
    const skus = await allSkuBySpuId({ product_id: spu.product_id })

    return {
      spu_info: _.omit(spu, ['__v', 'updatedAt' ]),
      sku_list: skus.map(sku => _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted' ]))
    }
  } catch (error) {

  }
}

module.exports = {
  newSpu,
  oneSpu
};
