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
   * Command      : call
   * Aliases      : ring
   * Usage        : call
   * Cooldown     : 0
   */

  // Define data for loader
  name: "call",
  alias: ["ring"],
  description: "Call Ben",
  usage: "{cmdName}",

  // Execute the command asynchronously
  async execute(client, message, args) {
    const guildData = await message.client.persistence.get(
      String(message.guild.id),
    );

    if (guildData?.calling === true) {
      return message.reply("☎️ you're already in a call with Ben!");
    }

    await client.persistence.set(String(message.guild.id), { calling: true });

    const attachment = new AttachmentBuilder(
      "./src/assets/ben.ogg", // path file
      {
        name: "voice-message.ogg",
        duration: 0,
        waveform:
          "acU6Va9UcSVZzsVw7IU/80s0Kh/pbrTcwmpR9da4mvQejIMykkgo9F2FfeCd235K/atHZtSAmxKeTUgKxAdNVO8PAoZq1cHNQXT/PHthL2sfPZGSdxNgLH0AuJwVeI7QZJ02ke40+HkUcBoDdqGDZeUvPqoIRbE23Kr+sexYYe4dVq+zyCe3ci/6zkMWbVBpCjq8D8ZZEFo/lmPJTkgjwqnqHuf6XT4mJyLNphQjvFH9aRqIZpPoQz1sGwAY2vssQ5mTy5J5muGo+n82b0xFROZwsJpumDsFi4Da/85uWS/YzjY5BdxGac8rgUqm9IKh7E6GHzOGOy0LQIz3O4ntTg==",
      },
    );

    await message.reply({ files: [attachment], flags: 8192 });
  },
};
