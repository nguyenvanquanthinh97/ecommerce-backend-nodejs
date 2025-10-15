'use strict';

const SkuModel = require('../models/sku.model');
const { randomProductId } = require('../utils');

const newSku = async ({ spu_id, sku_list }) => {
  try {
    const convert_sku_list = sku_list.map(sku => {
      return {...sku, product_id: spu_id, sku_id: `${spu_id}.${randomProductId()}`}
    })

    console.log('convert_sku_list', convert_sku_list)
    const skus = await SkuModel.create(convert_sku_list)
    return skus
  } catch (error) {
    console.error(error);
    return []
  }
}

const oneSku = async ({ sku_id, product_id }) => {
  try {
    // read cache
    const sku = await SkuModel.findOne({
      sku_id, product_id
    })

    if (sku) {
      // TODO: set cache
    }
    return sku
  } catch (error) {
    return null
  }
}

const allSkuBySpuId = async ({ product_id}) => {
  try {
    // 1. spu_id
    const skus = await SkuModel.find({ product_id }).lean();
    return skus
    // 2. return array sku
  } catch (error) {

  }
}

module.exports = {
  newSku,
  oneSku,
  allSkuBySpuId
}
