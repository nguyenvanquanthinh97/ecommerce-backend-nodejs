const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

const grantList = [
  { role: "admin", resource: "profile", action: "update:any", attributes: "*" },
  {
    role: "admin",
    resource: "balance",
    action: "update:any",
    attributes: "*, !amount",
  },

  { role: "shop", resource: "profile", action: "update:own", attributes: "*" },
  {
    role: "shop",
    resource: "balance",
    action: "update:own",
    attributes: "*, !amount",
  },

  {
    role: "user",
    resource: "profile",
    action: "update:own",
    attributes: "*",
  },
  {
    role: "user",
    resource: "profile",
    action: "read:own",
    attributes: "*",
  },
];

// Declare the Schema of the Mongo model
const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      default: "user",
      enum: ["user", "shop", "admin"],
    },
    role_slug: { type: String, required: true },
    role_status: {
      type: String,
      default: "active",
      enum: ["active", "block", "pending"],
    },
    role_description: { type: String, default: "" },
    role_grants: [
      {
        resource: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [{ type: String, required: true }],
        attributes: [{ type: String, default: "*" }],
      },
    ],
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, roleSchema);
