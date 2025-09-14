"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const INTERVAL_SECONDS = 5000;
const MAXIMUM_CONNECTIONS_PER_CPU_CORE = 5;

const countConnect = () => {
  const numConnection = mongoose.connections.length;

  console.log(`Number of connections::${numConnection}`);
};

const checkOverloadConnect = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = numCores * MAXIMUM_CONNECTIONS_PER_CPU_CORE;

    console.log(`Active connections::${numConnection}`)
    console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`)

    if (numConnection > maxConnections) {
      console.error(`Overload connections: ${numConnection} connections for ${numCores} CPU cores. Memory usage: ${memoryUsage}`);

      // notify.send(...)
    }


  }, INTERVAL_SECONDS);
}

module.exports = {
  countConnect,
  checkOverloadConnect
};
