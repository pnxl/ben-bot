/*
 * On user interaction with command, execute given command or return an error.
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules
const { Events, Collection } = require("discord.js");
const print = require("../helpers/print");

// Export the command data for loader
module.exports = {
  /*
   * Event        : InteractionCreate/ChatInputCommand
   * Usage        : On
   */

  // Define data for loader
  name: Events.InteractionCreate,
  once: false,

  // Execute the event asynchronously
  async execute(interaction) {
    // Ignore the interaction if it isn't a command
    if (!interaction.isChatInputCommand()) return;

    // Get the command name from the collection
    const cmd = interaction.client.commands.get(interaction.commandName);

    // If the command doesn't exist, return an error.
    if (!cmd) {
      await interaction.reply({
        content:
          "Sorry! I've encountered an error processing your command, something inside me must've went wrong. Please try again later!",
        ephemeral: true,
      });
      print.error(
        `No command matching /${interaction.commandName} was found! Did you re-deploy your commands?`
      );
      return;
    }

    const { slashCooldowns } = interaction.client;

    if (!slashCooldowns.has(cmd.data.name)) {
      slashCooldowns.set(cmd.data.name, new Collection());
    }

    // Get current time
    const now = Date.now();

    // Get cooldown
    const timestamps = slashCooldowns.get(cmd.data.name);
    const cooldown = cmd.cooldown * 1000;

    // If user has a cooldown
    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldown;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        print.debug(
          message.author.username +
            ` <${message.author.id}> attempted to run /${cmd.name} but was on a ${cmd.cooldown} second cooldown.`
        );
        return interaction.reply({
          content: `You're sending commands too fast! You can try again <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldown);

    try {
      // Try to execute the command
      await cmd.execute(interaction);
      print.debug(
        message.author.username + `<${message.author.id}> ran /${cmd.name}.`
      );
    } catch (err) {
      // If the execution fails, log to console and return an error message
      print.error(
        message.author.username +
          ` <${message.author.id}> attempted to run /${cmd.name} encountered an error.\n` +
          err
      );
      await interaction.reply({
        content:
          "We're sorry, an internal error has occurred. Rest assured, we are trying to fix this as fast as possible.",
        ephemeral: true,
      });
    }
  },
};
