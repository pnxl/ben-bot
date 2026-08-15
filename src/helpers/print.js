/*
 * Print helper for beautiful console logging. print.debug
 * only shows if you have `verbose = true` on config!
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules and load from .env file
const chalk = require("chalk");
const config = require("../../config.json");

module.exports = class print {
  static debug(str) {
    if (config.verbose === true) {
      console.log(chalk.dim(`[DBG] ${str}`));
    }
  }
  static info(str) {
    console.log(`[${chalk.blue("INF")}] ${chalk.dim(str)}`);
  }
  static log(str) {
    console.log(`[${chalk.cyan("LOG")}] ${str}`);
  }
  static warn(str) {
    console.log(`${chalk.black.bgYellow("WRN")} ${chalk.yellow(str)}`);
  }
  static error(str) {
    console.log(`${chalk.black.bgRed("ERR")} ${chalk.red(str)}`);
  }
};
