const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");

module.exports = class GuildMemberRemoveEvent extends BaseEvent {
  constructor() {
    super("guildMemberRemove");
    this.connection = StateManager.connection;
  }

  async run(client, member) {
    this.connection
      .query(`SELECT goodbye_channel FROM guild_configs WHERE guild_id = '${member.guild.id}'`)
      .then((result) => {
        const goodbyeChannel = result[0][0].goodbye_channel;
        const channel = member.guild.channels.cache.get(goodbyeChannel);
        if (channel) channel.send(`**${member.user.tag}** has left the server!`);
      })
      .catch((err) => console.log(err));
  }
};
