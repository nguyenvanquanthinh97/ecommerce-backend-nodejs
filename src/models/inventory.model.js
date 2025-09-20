const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

// Declare the Schema of the Mongo model
const InventorySchema = new mongoose.Schema(
  {
    inven_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    inven_location: {
      type: String,
      default: 'unknown'
    },
    inven_stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
    },
    inven_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true
    },
    inven_reservations: {
      /**
       * cartId: ObjectId,
       * stock: Number,
       * createdAt: Date
       */
      type: Array,
      default: []
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = {
  InventoryModel: mongoose.model(DOCUMENT_NAME, InventorySchema)
};
