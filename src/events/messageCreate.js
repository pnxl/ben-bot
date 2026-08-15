/*
 * Listen for any legacy commands (with prefix defined in config) and execute command.
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules
const { Events, Collection, AttachmentBuilder } = require("discord.js");
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
  async execute(message) {
    if (message.author.bot) return;

    const guildData = await message.client.persistence.get(
      String(message.guild.id),
    );

    if (
      guildData?.calling != true &&
      !message.content.startsWith(config.prefix)
    )
      return;
    else if (
      guildData?.calling === true &&
      !message.content.startsWith(config.prefix)
    ) {
      // respond 2/3 of the time with a random attachment
      if (Math.random() > 0.66) return;

      // get a random attachment
      const attachments = [
        "./src/assets/hohoho.ogg",
        "./src/assets/no.ogg",
        "./src/assets/yes.ogg",
      ];

      const attachment = new AttachmentBuilder(
        attachments[Math.floor(Math.random() * attachments.length)], // path file
        {
          name: "voice-message.ogg",
          duration: 0,
          waveform:
            "acU6Va9UcSVZzsVw7IU/80s0Kh/pbrTcwmpR9da4mvQejIMykkgo9F2FfeCd235K/atHZtSAmxKeTUgKxAdNVO8PAoZq1cHNQXT/PHthL2sfPZGSdxNgLH0AuJwVeI7QZJ02ke40+HkUcBoDdqGDZeUvPqoIRbE23Kr+sexYYe4dVq+zyCe3ci/6zkMWbVBpCjq8D8ZZEFo/lmPJTkgjwqnqHuf6XT4mJyLNphQjvFH9aRqIZpPoQz1sGwAY2vssQ5mTy5J5muGo+n82b0xFROZwsJpumDsFi4Da/85uWS/YzjY5BdxGac8rgUqm9IKh7E6GHzOGOy0LQIz3O4ntTg==",
        },
      );

      await message.reply({ files: [attachment], flags: 8192 });

      return;
    }

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const cmdName = args[0].toLowerCase();

    const cmd =
      message.client.cmds.get(cmdName) ||
      message.client.cmds.find((c) => c.alias && c.alias.includes(cmdName));

    if (!cmd) return;

    if (cmd.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (!authorPerms || !authorPerms.has(cmd.permissions)) {
        print.debug(
          message.author.username +
            ` <${message.author.id}> attempted to run ${config.prefix}${cmd.name} but did not have the necessary permissions.`,
        );
        return message.reply(
          "You don't have the permission to run this command!",
        );
      }
    }

    if (cmd.args && !args.length) {
      print.debug(
        message.author.username +
          ` <${message.author.id}> attempted to run ${config.prefix}${cmd.name} but did not enter any arguments.`,
      );

      return message.reply(`You didn't provide any arguments!`);
    }

    try {
      // Try to execute the command
      await cmd.execute(message.client, message, args);
      print.debug(
        message.author.username +
          ` <${message.author.id}> ran ${config.prefix}${cmd.name}.`,
      );
    } catch (err) {
      // If the execution fails, log to console and return an error message
      print.error(
        message.author.username +
          ` <${message.author.id}> attempted to run ${config.prefix}${cmd.name} encountered an error.\n` +
          err,
      );
      message.reply(
        "Sorry! I've encountered an error processing your command, something inside me must've went wrong. Please try again later!",
      );
      return;
    }
  },
};
