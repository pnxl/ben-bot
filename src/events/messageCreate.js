/*
 * Listen for any legacy commands (with prefix defined in config) and execute command.
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules
const { Events, Collection } = require("discord.js");
const config = require("../../config.json");
const print = require("../helpers/print");

// Export the command data for loader
module.exports = {
  /*
   * Event        : MessageCreate
   * Usage        : On
   */

  // Define data for loader
  name: Events.MessageCreate,
  once: false,

  // Execute the event asynchronously
  async execute(message, client) {
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const cmdName = args[0].toLowerCase();

    const cmd =
      message.client.legacyCmds.get(cmdName) ||
      message.client.legacyCmds.find(
        (c) => c.alias && c.alias.includes(cmdName)
      );

    if (!cmd) return;

    if (cmd.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (!authorPerms || !authorPerms.has(cmd.permissions)) {
        print.debug(
          message.author.username +
            ` <${message.author.id}> attempted to run ${config.prefix}${cmd.name} but did not have the necessary permissions.`
        );
        return message.reply(
          "You don't have the permission to run this command!"
        );
      }
    }

    if (cmd.args && !args.length) {
      print.debug(
        message.author.username +
          ` <${message.author.id}> attempted to run ${config.prefix}${cmd.name} but did not enter any arguments.`
      );

      return message.reply(`You didn't provide any arguments!`);
    }

    const { legacyCooldowns } = message.client;

    if (!legacyCooldowns.has(cmd.name)) {
      legacyCooldowns.set(cmd.name, new Collection());
    }

    // Get current time
    const now = Date.now();

    // Get cooldown
    const timestamps = legacyCooldowns.get(cmd.name);
    const cooldown = cmd.cooldown * 1000;

    // If user has a cooldown
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldown;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        print.debug(
          message.author.username +
            ` <${message.author.id}> attempted to run ${config.prefix}${cmd.name} but was on a ${cmd.cooldown} second cooldown.`
        );
        return message.reply(
          `You're sending commands too fast! You can try again <t:${expiredTimestamp}:R>.`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldown);

    try {
      // Try to execute the command
      await cmd.execute(client, message, args);
      print.debug(
        message.author.username +
          ` <${message.author.id}> ran ${config.prefix}${cmd.name}.`
      );
    } catch (err) {
      // If the execution fails, log to console and return an error message
      print.error(
        message.author.username +
          ` <${message.author.id}> attempted to run ${config.prefix}${cmd.name} encountered an error.\n` +
          err
      );
      message.reply(
        "Sorry! I've encountered an error processing your command, something inside me must've went wrong. Please try again later!"
      );
      return;
    }
  },
};
