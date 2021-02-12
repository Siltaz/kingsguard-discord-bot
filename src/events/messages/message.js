const Discord = require("discord.js");
const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const guildPrefixes = new Map();

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("message");
    this.connection = StateManager.connection;
  }

  async run(client, message) {
    if (message.author.bot) return;
    const prefix = guildPrefixes.get(message.guild.id);
    const usedPrefix = message.content.toLowerCase().slice(0, prefix.length);

    if (prefix === usedPrefix) {
      const [cmdName, ...cmdArgs] = message.content.slice(prefix.length).split(/\s+/);
      const command = client.commands.get(cmdName);

      if (command) command.run(command, message, cmdArgs);
    }

    // Bot channels moderation
    this.connection.query('SELECT * FROM bot_channels WHERE guild_id=? AND channel_id=?', [message.guild.id, message.channel.id])
      .then(result1 => {
        if (!result1[0].length) return;
        const channel = result1[0][0];

        this.connection.query('SELECT * FROM channel_prefixes WHERE bot_channel_id=?', [channel.id])
          .then(result2 => {
            let isAllowed = false;
            const channelPrefixes = result2[0];

            channelPrefixes.every(row => {
              isAllowed = message.content.startsWith(row.prefix);
              if (isAllowed) return false;
              else return true;
            });

            if (!isAllowed) {
              // Deletes last messages sent by BOT
              message.channel.messages.fetch({ limit: 10 })
                .then(messages => messages.forEach(msg => {
                  if (msg.author.id === client.user.id) msg.delete();
                }));

              // Sends warning message
              const newEmbed = new Discord.MessageEmbed()
                .setColor("#FF8C00")
                .setTitle("This message doesn't belong here")
                .setDescription(`Only \`${channel.bot_name} bot\` commands are allowed here !!`);
              message.channel.send(newEmbed);
              message.delete();
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
};

StateManager.on("prefixUpdate", (guildId, prefix) => {
  guildPrefixes.set(guildId, prefix);
});

StateManager.on("prefixRemoved", (guildId) => {
  guildPrefixes.delete(guildId);
});
