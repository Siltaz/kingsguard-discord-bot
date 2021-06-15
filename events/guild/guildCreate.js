const StateManager = require("../../utils/StateManager");
const serverConfigModel = require('../../models/serverConfig');

module.exports = async (Discord, client, guild) => {

  let serverconfig = await serverConfigModel.create({
    serverID: guild.id,
    serverOwnerID: guild.ownerID
  });

  serverconfig.save();
  StateManager.emit('prefixUpdate', guild.id, '?');
}
