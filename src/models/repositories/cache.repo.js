'use strict';

const { getRedis } = require('../../dbs/init.redis')

const rediscache = getRedis()

const setCache = async ({
  key, value
}) => {
  if (!rediscache) {
    throw new Error('Redis client is not initialized')
  }
  try {
    return await rediscache.set(key, value)
  } catch (error) {
    throw new Error(`${error.message}`)
  }
}

const setCacheExpiration = async ({ key, value, expirationInSeconds }) => {
  if (!rediscache) {
    throw new Error('Redis client is not initialized')
  }
  try {
    return await rediscache.set(key, value, 'EX', expirationInSeconds)
  } catch (error) {
    throw error
  }
}

const getCache = async ({ key }) => {
  if (!rediscache) {
    throw new Error('Redis client is not initialized')
  }
  try {
    return await rediscache.get(key)
  } catch (error) {
    throw new Error(`${error.message}`)
  }
}

module.exports = {
  setCache,
  getCache,
  setCacheExpiration
}
