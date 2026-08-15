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
  const cmdFolder = readdirSync("./src/commands/legacy");

  for (const folder of cmdFolder) {
    // Define the path for commands folder and filter only .js files
    const cmdFile = readdirSync(`./src/commands/legacy/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    // Create arrays for event counting
    let cmdCount = 0;

    for (const file of cmdFile) {
      const cmd = require(`../../commands/legacy/${folder}/${file}`);
      cmdCount++;
      print.debug(
        `The legacy command \`${file}\` has been loaded successfully!`
      );

      try {
        client.legacyCmds.set(cmd.name, cmd);
      } catch (err) {
        return print.error(err);
      }

      print.log(
        `Successfully loaded ${client.legacyCmds.size} legacy commands.`
      );
    }
  }
};
