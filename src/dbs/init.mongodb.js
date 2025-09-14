"use strict";
const mongoose = require("mongoose");

const { db: { host, port, name } } = require('../configs/config.mongodb');
const { countConnect } = require("../helpers/check.connect");

const connectionString =
  process.env.MONGODB_URI || `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectionString)
      .then((_) => console.log("MongoDB connected", countConnect()))
      .catch((err) => console.error("Error Connect!"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
