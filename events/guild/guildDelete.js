const StateManager = require("../../utils/StateManager");
const serverConfigModel = require('../../models/serverConfig');

module.exports = async (Discord, client, guild) => {
  await serverConfigModel.findOneAndDelete({ serverID: guild.id });
  StateManager.emit('prefixRemoved', guild.id);
}
