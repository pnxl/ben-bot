/*
 * Command deployment script; the bot only deploys commands
 * to one specific guild, so make sure you put your guild
 * ID on the .env file!
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules and load from .env file
const { REST, Routes } = require("discord.js");
const { readdirSync } = require("node:fs");
require("dotenv").config();

// Clear the console when started
console.clear();

// Create a new array for commands
const cmds = [];

// Define the path for commands folder and filter only .js files
const cmdFile = readdirSync("./src/commands/").filter((file) =>
  file.endsWith(".js")
);

// Grab data from SlashCommandBuilder, then throws the output to the array.
for (const f of cmdFile) {
  const cmd = require(`./commands/${f}`);
  if ("data" in cmd && "execute" in cmd) {
    cmds.push(cmd.data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Builds and prepares an instance of the REST module
const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(`Started deployment of ${cmds.length} application commands.`);

    // Fully refresh and deploy all commands in the guild with current set
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.SERVER_ID
      ),
      { body: cmds }
    );

    // Deploy all commands to all guilds with current set.
    /* const data = await rest.put(
     *   Routes.applicationCommands(
     *     process.env.CLIENT_ID
     *   ),
     *   { body: cmds }
     * );
     */

    console.log(`Successfully deployed ${data.length} application commands.`);
  } catch (e) {
    // Catch all errors that may arise.
    console.error(e);
  }
})();
