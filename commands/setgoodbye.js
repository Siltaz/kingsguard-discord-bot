const styledMsg = require('../utils/embed');
const serverConfigModel = require('../models/serverConfig');

module.exports = {
	name: 'setgoodbye',
	async run(Discord, client, message, args) {
		if (message.member.id === message.guild.ownerID) {
			let channelID = args[0];
			if (channelID) {
				const channel = message.guild.channels.cache.get(channelID);
				channelID = channel ? channelID : null;
				try {
					await serverConfigModel.findOneAndUpdate({ serverID: message.guild.id }, { goodbyeChannel: channelID });
					styledMsg(message.channel, 'Successfully Updated \`goodbye_channel\`', 'SUCCESS');
				} catch (err) {
					console.log(err);
					styledMsg(message.channel, 'Failed to update \`goodbye_channel\`', 'ERROR');
				}
			}
			else styledMsg(message.channel, 'Incorrect amount of arguments', 'ERROR');
		} else styledMsg(message.channel, 'You do not have permission to use that command', 'ERROR');
	}
}
