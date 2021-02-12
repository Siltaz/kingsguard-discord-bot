const styledMsg = require('../../utils/embed');
const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require('../../utils/StateManager');

module.exports = class ChangePrefixCommand extends BaseCommand {
  constructor() {
    super("chprefix", "setup", []);
    this.connection = StateManager.connection;
  }

  async run(client, message, args) {
    if (message.member.id === message.guild.ownerID) {
      const newPrefix = args[0];
      if (newPrefix) {
        try {
          await this.connection.query(`UPDATE guild_configs SET prefix = ? WHERE guild_id = ?`, [newPrefix, message.guild.id]);
          styledMsg(message.channel, `Updated prefix to \`${newPrefix}\``, 'SUCCESS');
          StateManager.emit('prefixUpdate', message.guild.id, newPrefix);
        } catch (err) {
          console.log(err);
          styledMsg(message.channel, `Failed to update prefix to \`${newPrefix}\``, 'ERROR');
        }
      }
      else styledMsg(message.channel, 'Incorrect amount of arguments', 'ERROR');
    } else styledMsg(message.channel, 'You do not have permission to use that command', 'ERROR');
  }
};
