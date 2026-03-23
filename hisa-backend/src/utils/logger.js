const winston = require("winston");
const path = require("path");

const LOG_DIR = path.join(__dirname, "../../logs");

const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const level = () => (process.env.NODE_ENV === "production" ? "warn" : "debug");

const colors = { error: "red", warn: "yellow", info: "green", http: "magenta", debug: "white" };
winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ filename: `${LOG_DIR}/error.log`, level: "error" }),
  new winston.transports.File({ filename: `${LOG_DIR}/all.log` }),
];

const logger = winston.createLogger({ level: level(), levels, format, transports });

module.exports = logger;
