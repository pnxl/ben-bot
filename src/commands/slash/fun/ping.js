/*
 * A basic test command, it only responds with "Pong!" when it is executed.
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules
const { SlashCommandBuilder } = require("discord.js");

// Export the command data for loader
module.exports = {
  /*
   * Command      : ping
   * Aliases      :
   * Usage        : ping
   * Cooldown     : 0
   */

  // Define data for loader
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  usage: "{cmdName}",
  cooldown: 0,

  // Execute the command asynchronously
  async execute(interaction) {
    // Reply to the user with "Pong!"
    await interaction.reply("Pong!");
  },
};
