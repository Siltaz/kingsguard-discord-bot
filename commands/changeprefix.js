const styledMsg = require('../utils/embed');
const serverConfigModel = require('../models/serverConfig');
const StateManager = require('../utils/StateManager');

module.exports = {
	name: 'chprefix',
	async run(Discord, client, message, args) {
		if (message.member.id === message.guild.ownerID) {
			const newPrefix = args[0];
			if (newPrefix) {
				try {
					await serverConfigModel.findOneAndUpdate({ serverID: message.guild.id }, { prefix: newPrefix });
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
}
