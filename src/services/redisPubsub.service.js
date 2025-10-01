"use strict";
const Redis = require("ioredis");

class RedisPubSubService {
  constructor() {
    this.publisher = new Redis();
    this.subscriber = new Redis();
  }

  async publish(channel, message) {
    return await this.publisher.publish(channel, message);
  }

  async subscribe(channel, callback) {
    await this.subscriber.subscribe(channel);
    this.subscriber.on("message", (subscribedChannel, message) => {
      if (subscribedChannel === channel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
