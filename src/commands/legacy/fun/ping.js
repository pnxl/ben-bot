/*
 * A basic test command, it only responds with "Pong!" when it is executed.
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Export the command data for loader
module.exports = {
  /*
   * Command      : ping
   * Aliases      :
   * Usage        : ping
   * Cooldown     : 0
   */

  // Define data for loader
  name: "ping",
  alias: ["pong"],
  description: "Pong!",
  usage: "{cmdName}",
  cooldown: 0,

  // Execute the command asynchronously
  async execute(client, message, args) {
    // Reply to the user with "Pong!"
    await message.reply("Pong!");
  },
};
