"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

// Declare the Schema of the Mongo model
const OrderSchema = new mongoose.Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    /*
      order_checkout = {
        totalPrice,
        totalApplyDiscount,
        feeShip
      }
    */
    order_checkout: {
      type: Object,
      default: {}
    },
    /*
      street,
      city,
      state,
      country,
    */
    order_shipping: {
      type: Object,
      default: {}
    },
    order_payment: {
      type: Object,
      default: {}
    },
    order_products: {
      type: Array,
      required: true,
    },
    order_trackingNumber: {
      type: String,
      default: "0000118052022",
    },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = {
  OrderModel: mongoose.model(DOCUMENT_NAME, OrderSchema),
};
