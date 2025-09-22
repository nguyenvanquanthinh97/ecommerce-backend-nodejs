"use strict";

const Redis = require("ioredis");
const { reservationInventory } = require("../models/repositories/inventory.repo");
const redis = new Redis()

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2025_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let index=0; index < retryTimes; index++) {
    // create a key, allow who hold it to process payment
    const result = await redis.setnx(key, expireTime);
    console.log(`result:::`, result);
    if (result === 1) {
      // interact with redis inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId
      })

      if (isReservation.modifiedCount) {
        await redis.pexpire(key, expireTime);
        return key
      }
      return key;
    } else {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async keyLock => {
  return await redis.del(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock
};
