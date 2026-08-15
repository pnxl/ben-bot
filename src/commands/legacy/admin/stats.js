/*
 * Shows you the current statistics of the server it's hosted on.
 *
 * Copyright (c) Jason Fang 2025
 * Code is licensed under MIT
 */

// Import the required modules
const { EmbedBuilder } = require("discord.js");
const si = require("systeminformation");
const package = require("../../../../package.json");

// Export the command data for loader
module.exports = {
  /*
   * Command      : stats
   * Aliases      : statistics, hostinfo
   * Usage        : stats
   * Cooldown     : 0
   */

  // Define data for loader
  name: "stats",
  alias: ["statistics", "hostinfo"],
  description: "Shows you the current statistics of my home.",
  usage: "{cmdName}",
  cooldown: 0,

  // Execute the command asynchronously
  async execute(client, message, args) {
    await message.channel.sendTyping();

    const tme = si.time();
    const sys = await si.system();
    const bas = await si.baseboard();
    const efi = await si.bios();
    const ops = await si.osInfo();
    const ver = await si.versions();
    const cpu = await si.cpu();
    const mem = await si.mem();
    const gpu = (await si.graphics()).controllers[0];
    const cur = await si.currentLoad();
    const prc = await si.processes();

    function progress(percent) {
      let indicator = 50;
      const percentage = percent / 100;
      const fraction = indicator - indicator * percentage;
      const array = ["["];
      while (indicator--) {
        array.push(indicator < fraction ? " " : "•");
      }
      return array.join("") + "]";
    }

    const embed = new EmbedBuilder()
      .setColor(0x91b7f7)
      .setTitle("Statistics")
      .addFields(
        { name: "Hostname", value: ops.hostname },
        {
          name: "Model",
          value: `${sys.manufacturer} ${sys.model} ${sys.version} ${
            sys.virtual === true ? "(Virtualised)" : ""
          }`,
          inline: true,
        },
        {
          name: "Baseboard",
          value: `${bas.manufacturer} ${bas.model} ${bas.version}`,
          inline: true,
        },
        {
          name: "Firmware",
          value: `${efi.vendor} ${efi.version} (rev ${efi.revision})`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: `Operating System`,
          value: `${ops.distro} ${ops.release} ${ops.arch}`,
        },
        {
          name: `Codename`,
          value: ops.codename,
          inline: true,
        },
        {
          name: `Kernel`,
          value: `${ops.platform} (${ops.kernel})`,
          inline: true,
        },
        {
          name: `Architecture`,
          value: ops.arch,
          inline: true,
        },
        {
          name: `Node Version`,
          value: ver.node,
          inline: true,
        },
        {
          name: `npm Version`,
          value: ver.npm,
          inline: true,
        },
        {
          name: `discord.js Version`,
          value: package.dependencies["discord.js"],
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: `Processor (${cpu.processors})`,
          value: `${cpu.manufacturer} ${cpu.brand} @ ${cpu.speed} GHz (${cpu.physicalCores}c, ${cpu.cores}t)`,
        },
        {
          name: `Memory`,
          value: `${Math.round(mem.total / 1000000000)} GB total | ${Math.round(
            (mem.total - mem.available) / 1000000000
          )} GB used / ${Math.round(mem.available / 1000000000)} GB free)`,
        },
        {
          name: `Graphics`,
          value: `${gpu.subVendor} ${gpu.vendor} ${gpu.model} (${gpu.bus} | ${gpu.busAddress})`,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: `CPU Usage (${Math.round(cur.currentLoad)}%)`,
          value: `\`\`\`${progress(
            cur.currentLoad
          )}\n0%                                              100%\`\`\``,
        },
        {
          name: `Memory Usage (${Math.round(
            (mem.total - mem.available) / 1000000000
          )} GB used)`,
          value: `\`\`\`${progress(
            ((mem.total - mem.available) / mem.total) * 100
          )}\n0 B                                            ${Math.round(
            mem.total / 1000000000
          )} GB\`\`\``,
        },
        {
          name: `System Uptime`,
          value: `${Math.round(tme.uptime / 60)} minutes`,
          inline: true,
        },
        {
          name: `# of Processes`,
          value: `${prc.all}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: "Requested by " + message.author.tag });

    // Reply with statistics result
    message.reply({
      embeds: [embed],
    });
  },
};
