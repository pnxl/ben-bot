/*
 * Dynamic help command that grabs from commands collection and puts them in a nice embed for user.
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

// Export the command data for loader
module.exports = {
  // Define data for loader
  name: "help",
  alias: [],
  description: "shows all commands or info about a specific command",
  usage: "{cmdName} (command)",
  cooldown: 0,

  // Execute the command asynchronously
  async execute(client, message, args) {
    if (args.length > 1) {
      const embed = new EmbedBuilder().setColor(0xb880fc);

      const cmdName = args[1].toLowerCase();
      const cmd =
        message.client.cmds.get(cmdName) ||
        message.client.cmds.find(
          (cmd) => cmd.alias && cmd.alias.includes(cmdName),
        );

      if (!cmd) {
        return message.reply({
          content: `that command does not exist! 🐕‍🦺`,
        });
      }

      embed.setTitle(`${config.prefix}${cmd.name}`);
      embed.setDescription(
        cmd.description || "this command doesn't have a description!",
      );
      embed.addFields(
        {
          name: "usage",
          value: config.prefix + cmd.usage.replace(/{cmdName}/g, cmd.name),
        },
        {
          name: "aliases",
          value: cmd.alias.length
            ? cmd.alias.join(", ")
            : "this command has no aliases",
        },
        { name: "cooldown", value: `${cmd.cooldown || 0} seconds` },
      );

      // Reply with eval result
      message.reply({
        embeds: [embed],
      });
    } else {
      const embed = new EmbedBuilder()
        .setColor(0xb880fc)
        .setTitle("all commands");

      // Get commands from collection
      for (const key of message.client.cmds) {
        const cmd = key[1];

        if (cmd.folder === "admin") {
          continue;
        } else {
          embed.addFields({
            name: `${config.prefix}${cmd.usage.replace(
              /{cmdName}/g,
              cmd.name,
            )} `,
            value: cmd.description,
          });
        }
      }

      // Reply with eval result
      message.reply({
        embeds: [embed],
      });
    }
  },
};
