const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");

module.exports = class GuildCreateEvent extends BaseEvent {
  constructor() {
    super("guildCreate");
    this.connection = StateManager.connection;
  }

  async run(client, guild) {
    try {
      await this.connection.query(
        `INSERT INTO guilds VALUES('${guild.id}', '${guild.ownerID}')`
      );

      await this.connection.query(
        `INSERT INTO guild_configs(guild_id) VALUES('${guild.id}')`
      );
      StateManager.emit('prefixUpdate', guild.id, '?');
    } catch (err) {
      console.log(err);
    }
  }
};
