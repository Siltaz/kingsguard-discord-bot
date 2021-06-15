const StateManager = require("../../utils/StateManager");
const botChannelModel = require('../../models/botChannel')

const guildPrefixes = new Map();

module.exports = async (Discord, client, message) => {

	if (message.author.bot) return;
	const prefix = guildPrefixes.get(message.guild.id);
	const usedPrefix = message.content.toLowerCase().slice(0, prefix.length);
	
	if (prefix === usedPrefix) {
		const args = message.content.slice(prefix.length).split(/\s+/);
		const cmd = args.shift().toLowerCase();

		const command = client.commands.get(cmd);
		if (command) command.run(Discord, client, message, args);
	}

	// Bot channels moderation
	let botChannel = await botChannelModel.findOne({ serverID: message.guild.id, channelID: message.channel.id });
	if (!botChannel) return;

	const channel = botChannel.channelID;
	const channelPrefixes = botChannel.prefixes;
	let isAllowed = false;

	channelPrefixes.every(prefix => {
		isAllowed = message.content.startsWith(prefix);
		if (isAllowed) return false;
		else return true;
	});

	if (!isAllowed) {
		// Deletes last messages sent by BOT
		message.channel.messages.fetch({ limit: 10 })
			.then(messages => messages.forEach(msg => {
				if (msg.author.id === client.user.id) msg.delete();
			}));

		// Sends warning message
		const newEmbed = new Discord.MessageEmbed()
			.setColor("#FF8C00")
			.setTitle("This message doesn't belong here")
			.setDescription(`Only \`${botChannel.botName} bot\` commands are allowed here !!`);
		message.channel.send(newEmbed);
		message.delete();
	}
}

StateManager.on("prefixUpdate", (guildId, prefix) => {
	guildPrefixes.set(guildId, prefix);
});

StateManager.on("prefixRemoved", (guildId) => {
	guildPrefixes.delete(guildId);
});
