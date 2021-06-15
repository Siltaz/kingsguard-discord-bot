const serverConfigModel = require('../../models/serverConfig')

module.exports = async (Discord, client, member) => {
	
	let serverConfig = await serverConfigModel.findOne({ serverID: member.guild.id });
	const goodbyeChannel = serverConfig.goodbyeChannel;
	const channel = member.guild.channels.cache.get(goodbyeChannel);
	if (channel) channel.send(`**${member.user.tag}** has left the server!`);
}
