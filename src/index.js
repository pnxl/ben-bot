/*
 * The main bot file, it handles events and logins to the
 * Discord API
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules and load from .env file
const { Keyv } = require("keyv");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();

// Clear the console when started
console.clear();

// Create a new Keyv instance for persisting data
const persistence = new Keyv("sqlite://./src/persistence.sqlite");

// Create a new client and a collection for the commands
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
client.cmds = new Collection();

// Attach the persistence instance to the client for global access
client.persistence = persistence;

// Call the command and event loader
require("./miscellaneous/loader/command")(client);
require("./miscellaneous/loader/event")(client);

persistence.on("error", (err) => console.error("Keyv connection error:", err));

// Finally, login to the Discord API
client.login(process.env.BOT_TOKEN);
