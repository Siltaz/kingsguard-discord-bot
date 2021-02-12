const BaseEvent = require("../../utils/structures/BaseEvent");
const firstMessage = require("../../utils/first-message");
const StateManager = require("../../utils/StateManager");
const guildPrefixes = new Map();

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
    this.connection = StateManager.connection;
  }

  async run(client) {
    console.log("Initializing Client...");
    client.guilds.cache.forEach(guild => {
      this.connection
        .query(`SELECT prefix FROM guild_configs WHERE guild_id = '${guild.id}'`)
        .then((result) => {
          const guildId = guild.id;
          const prefix = result[0][0].prefix;
          guildPrefixes.set(guildId, prefix);
          StateManager.emit("prefixUpdate", guildId, prefix);
        })
        .catch((err) => console.log(err));

      // First Message
      this.connection
        .query(`SELECT * FROM role_channels WHERE guild_id = '${guild.id}'`)
        .then((result) => {
          if (!result[0].length) return;
          result[0].forEach(ch => {
            this.connection.query('SELECT * FROM reaction_roles WHERE role_channel_id=?', [ch.id])
              .then((res) => {
                if (!res[0].length) return;
                const reactions = [];
                let text = `>>> \n**${ch.heading}**\n\n`;
                res[0].forEach(r => {
                  reactions.push(r.emoji);
                  text += `${r.emoji} : \`${r.role}\`\n\n`;
                });
                firstMessage(client, ch.channel_id, text, reactions);
              })
              .catch((err) => console.log(err));
          });
        })
        .catch((err) => console.log(err));
    });
    client.user.setActivity(`?help`, { type: "LISTENING" });
    console.log(`${client.user.tag} is online 🔥`);
  }
}
