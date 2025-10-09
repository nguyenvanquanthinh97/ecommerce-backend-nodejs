'use strict';
const Redis = require('ioredis');
const { RedisErrorResponse } = require('../core/error.response');

let client = {}
let statusConnectRedis = {
  CONNECT: 'connect',
  END: 'end',
  RECONNECT: 'reconnecting',
  ERROR: 'error',
  READY: 'ready'
}
let connectionTimeout;

const REDIS_CONNECT_TIMEOUT = 10000
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: {
    vn: 'Redis kết nối thất bại, vui lòng thử lại sau',
    en: 'Redis connection failed, please try again later'
  }
}

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse(
      REDIS_CONNECT_MESSAGE.message.en,
      REDIS_CONNECT_MESSAGE.code
    )
  }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnect = ({
  connectionRedis
}) => {
  // check if connection is null
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(`connectionRedis - Connection status: connected`)
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(`connectionRedis - Connection status: disconnected`)
    // connect retry
    handleTimeoutError()
  })

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`connectionRedis - Connection status: reconnecting`)
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(statusConnectRedis.ERROR, (error) => {
    console.log(`connectionRedis - Connection status: error ${error}`)
    // connect retry
    handleTimeoutError()
  })
}

const initRedis = () => {
  const instanceRedis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB
  })

  client.instanceConnect = instanceRedis

  handleEventConnect({
    connectionRedis: instanceRedis
  })
}

const getRedis = () => {
  return client.instanceConnect
}

const closeRedis = () => {
  return client.instanceConnect.quit()
}

module.exports = {
  initRedis,
  getRedis,
  closeRedis
};
