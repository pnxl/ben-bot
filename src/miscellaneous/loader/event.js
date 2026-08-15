/*
 * This file loads the events inside the /events
 * folder, and then pushes it to the main bot file
 * for listening
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules
const { readdirSync } = require("node:fs");
const print = require("../../helpers/print");

module.exports = async (client) => {
  // Define the path for commands folder and filter only .js files
  const evnFile = readdirSync("./src/events/").filter((file) =>
    file.endsWith(".js")
  );

  // Create arrays for event counting
  let evnOn = 0;
  let evnOnce = 0;

  for (const f of evnFile) {
    const loc = `../../events/${f}`;
    const evn = require(loc);

    print.debug(`The event \`${f}\` has been loaded successfully!`);

    if (evn.once) {
      // If the event only happens once
      client.once(evn.name, (...args) => evn.execute(...args));
      evnOnce++;
    } else {
      // If the event happens multiple times
      client.on(evn.name, (...args) => evn.execute(...args));
      evnOn++;
    }
  }

  print.log(
    `Successfully loaded ${evnOnce} \`once\` and ${evnOn} \`on\` events.`
  );
};
