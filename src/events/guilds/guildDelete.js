const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super("guildDelete");
    this.connection = StateManager.connection;
  }

  async run(client, guild) {
    try {
      await this.connection.query('DELETE FROM guilds WHERE guild_id=?', [guild.id]);
      StateManager.emit('prefixRemoved', guild.id);
    } catch (err) {
      console.log(err);
    }
  }
};
