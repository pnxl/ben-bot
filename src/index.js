/*
 * The main bot file, it handles events and logins to the
 * Discord API
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules and load from .env file
const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();

// Clear the console when started
console.clear();

// Create a new client and a collection for the commands
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
client.slashCmds = new Collection();
client.legacyCmds = new Collection();

// Create a new collection to store cooldowns for commands
client.slashCooldowns = new Collection();
client.legacyCooldowns = new Collection();

// Call the command and event loader
require("./miscellaneous/loader/slashCmd")(client);
require("./miscellaneous/loader/legacyCmd")(client);
require("./miscellaneous/loader/event")(client);

// Finally, login to the Discord API
client.login(process.env.BOT_TOKEN);
