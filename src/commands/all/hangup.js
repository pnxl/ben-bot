/*
 * A basic test command, it only responds with "Pong!" when it is executed.
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

const { AttachmentBuilder } = require("discord.js");

// Export the command data for loader
module.exports = {
  /*
   * Command      : hangup
   * Aliases      : endcall, end, disconnect
   * Usage        : hangup
   */

  // Define data for loader
  name: "hangup",
  alias: ["endcall", "end", "disconnect"],
  description: "Hang up the call",
  usage: "{cmdName}",

  // Execute the command asynchronously
  async execute(client, message, args) {
    const guildData = await message.client.persistence.get(
      String(message.guild.id),
    );

    if (guildData?.calling != true) {
      await client.persistence.set(String(message.guild.id), {
        calling: false,
      });
      return message.reply("☎️ you're not in a call with Ben!");
    }

    await client.persistence.set(String(message.guild.id), { calling: false });

    await message.reply("☎️ \\*telephone hangup sound\\*");
  },
};
