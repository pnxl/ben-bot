/*
 * This file loads the commands inside the /commands
 * folder, and then pushes it to the commands collection
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules
const { readdirSync } = require("node:fs");
const print = require("../../helpers/print");

module.exports = async (client) => {
  // Define the path for commands folder and filter only .js files
  const cmdFolder = readdirSync("./src/commands/slash/");

  for (const folder of cmdFolder) {
    const cmdFile = readdirSync(`./src/commands/slash/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of cmdFile) {
      const cmd = require(`../../commands/slash/${folder}/${file}`);

      if ("data" in cmd && "execute" in cmd) {
        // Pushes the command to the command collection and logs said command
        client.slashCmds.set(cmd.data.name, cmd);
        print.debug(
          `The application command \`${file}\` has been loaded successfully!`
        );
      } else {
        // If the command doesn't have a data or execute property, warn the user
        print.warn(
          `The application command at ${folder}/${file} is missing a required \`data\` or \`execute\` property.`
        );
      }

      print.log(
        `Successfully loaded ${client.slashCmds.size} application commands.`
      );
    }
  }
};
