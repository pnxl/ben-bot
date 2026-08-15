/*
 * Once the ready event is emitted, log to console.
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules
const { Events } = require("discord.js");
const gradient = require("gradient-string");
const chalk = require("chalk");

// Export the command data for loader
module.exports = {
  /*
   * Event        : ClientReady
   * Usage        : Once
   */

  // Define data for loader
  name: Events.ClientReady,
  once: true,

  // Execute the event
  execute(client) {
    console.log(
      chalk.bold(
        gradient.pastel(
          "\nThe bot is ready! Logged in as " + client.user.tag + ".\n"
        )
      )
    );
  },
};
