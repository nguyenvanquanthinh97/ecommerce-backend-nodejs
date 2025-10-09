"use strict";

const winston = require("winston");
require("winston-daily-rotate-file");
const { v4: uuid } = require("uuid");

class MyLogger {
  constructor() {
    const formatPrint = winston.format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
          metadata
        )}`;
      }
    );

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS A" }),
        formatPrint
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "application-%DATE%.info.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          level: "info",
        }),
        new winston.transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          level: "error",
        }),
      ],
    });
  }

  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId || uuid();
    return {
      requestId,
      context,
      metadata,
    };
  }

  log(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramLog);
    this.logger.info(logObject);
  }

  error(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramLog);
    this.logger.error(logObject);
  }
}

module.exports = new MyLogger();
