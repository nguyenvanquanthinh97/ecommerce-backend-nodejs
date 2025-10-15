'use strict';

const { CACHE_PRODUCT } = require('../configs/constant');
const { getCache, setCache, setCacheExpiration } = require('../models/repositories/cache.repo');
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
    // 1. check params
    if (sku_id < 0) return null
    if (product_id < 0) return null

    // 2. read cache
    const skuKeyCache = `${CACHE_PRODUCT.SKU}${sku_id}`

    // 3. read from dbs
    // if (!skuCache) {
      // 4. read from dbs
      const skuCache = await SkuModel.findOne({
        sku_id, product_id
      }).lean()

      const valueCache = skuCache ? skuCache : null
      await setCacheExpiration({
        key: skuKeyCache,
        value: JSON.stringify(valueCache),
        expirationInSeconds: 30
      }).then()
    // }

    return {
      ...skuCache,
      toLoad: 'dbs' // dbs
    }

    // const sku = await SkuModel.findOne({
    //   sku_id, product_id
    // })

    // if (sku) {
    //   // TODO: set cache
    // }
    // return sku
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
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
