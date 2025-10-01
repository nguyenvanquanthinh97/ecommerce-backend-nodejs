const redisPubSubService = require("../services/redisPubsub.service");

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe("purchase_events", (channel, message) => {
      const { productId, quantity } = JSON.parse(message);
      InventoryServiceTest.updateInventory(productId, quantity);
    });
  }

  static updateInventory(productId, quantity) {
    console.log(`Inventory updated for product ${productId}, quantity: ${quantity}`);
  }
}

module.exports = new InventoryServiceTest();
