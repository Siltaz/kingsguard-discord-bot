const firstMessage = require("../../utils/first-message");
const StateManager = require("../../utils/StateManager");
const serverConfigModel = require('../../models/serverConfig');
const roleChannelModel = require('../../models/roleChannel');

const guildPrefixes = new Map();

module.exports = async (Discord, client) => {

  console.log("Initializing Client...");
  client.guilds.cache.forEach(async (guild) => {
    let serverConfig = await serverConfigModel.findOne({ serverID: guild.id });
    if (!serverConfig) return;

    const guildId = guild.id;
    const prefix = serverConfig.prefix;
    guildPrefixes.set(guildId, prefix);
    StateManager.emit("prefixUpdate", guildId, prefix);

    // First Message
    let roleChannel = await roleChannelModel.findOne({ serverID: guild.id });
    if (!roleChannel) return;
    if (!roleChannel.reactions.length) return;

    const reactions = [];
    let text = `>>> \n**${roleChannel.heading}**\n\n`;
    roleChannel.reactions.forEach(r => {
      reactions.push(r.emoji);
      text += `${r.emoji} : \`${r.role}\`\n\n`;
    });
    firstMessage(client, roleChannel.channelID, text, reactions);

  });

  client.user.setActivity(`?help`, { type: "LISTENING" });
  console.log(`${client.user.tag} is online 🔥`);
}
