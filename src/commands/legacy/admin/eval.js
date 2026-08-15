/*
 * Evaluates code. This can be VERY dangerous if not used properly, or is restricted to only the bot's owner.
 * You should remove this file if you do not use it.
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules
const { EmbedBuilder } = require("discord.js");
const config = require("../../../../config.json");
const print = require("../../../helpers/print");
const util = require("util");

// Export the command data for loader
module.exports = {
  /*
   * Command      : eval
   * Aliases      : exec, execute, evaluate
   * Usage        : eval [code]
   * Cooldown     : 0
   */

  // Define data for loader
  name: "eval",
  alias: ["evaluate", "exec", "execute"],
  description: "execute code",
  usage: "{cmdName} [code]",
  cooldown: 0,

  // Execute the command asynchronously
  async execute(client, message, args) {
    // If not owner, do nothing
    if (message.author.id !== config.ownerId)
      return print.info(
        message.author.username +
          ` <${message.author.id}> attempted to evaluate code but did not have the necessary permissions.`
      );

    // If no arguments, do nothing
    if (!args.length) return;

    // Join all arguments
    const code = args.join(" ").slice(5);

    async function clean(str) {
      if (str && str.constructor.name == "Promise") str = await str;

      if (typeof str !== "string") str = util.inspect(str, { depth: 1 });

      str = str
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));

      return str;
    }

    const evaluated = eval(code);
    const cleaned = await clean(evaluated);

    const embed = new EmbedBuilder()
      .setColor(0xb880fc)
      .setTitle("Evaluation Results")
      .addFields(
        { name: "Given Code", value: `\`\`\`js\n${code}\`\`\`` },
        { name: "Result", value: `\`\`\`bash\n${cleaned}\`\`\`` }
      )
      .setTimestamp()
      .setFooter({ text: "Requested by " + message.author.tag });

    // Reply with eval result
    message.reply({
      embeds: [embed],
    });

    // Log when owner evaluates command
    print.log(
      message.author.username + " evaluated the following code: " + code
    );
  },
};
