const styledMsg = require('../../utils/embed');
const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require('../../utils/StateManager');

module.exports = class SetGoodbyeCommand extends BaseCommand {

  constructor() {
    super("setgoodbye", "setup", []);
    this.connection = StateManager.connection;
  }

  async run(client, message, args) {
    if (message.member.id === message.guild.ownerID) {
      let channelID = args[0];
      if (channelID) {
        const channel = message.guild.channels.cache.get(channelID);
        channelID = channel ? channelID : null;
        try {
          await this.connection.query(`UPDATE guild_configs SET goodbye_channel = ? WHERE guild_id = ?`, [channelID, message.guild.id]);
          styledMsg(message.channel, 'Successfully Updated \`goodbye_channel\`', 'SUCCESS');
        } catch (err) {
          console.log(err);
          styledMsg(message.channel, 'Failed to update \`goodbye_channel\`', 'ERROR');
        }
      }
      else styledMsg(message.channel, 'Incorrect amount of arguments', 'ERROR');
    } else styledMsg(message.channel, 'You do not have permission to use that command', 'ERROR');
  }
};
