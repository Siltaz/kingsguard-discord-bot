const Canvas = require("canvas");
const path = require('path');
const serverConfigModel = require('../../models/serverConfig')

module.exports = async (Discord, client, member) => {

	const canvas = Canvas.createCanvas(700, 260);
	const ctx = canvas.getContext("2d");
	const background = await Canvas.loadImage(path.join(__dirname, "../../assets/banner.jpg"));

	let x = 0;
	let y = 0;

	ctx.drawImage(background, x, y);
	const pfp = await Canvas.loadImage(member.user.displayAvatarURL({ format: "png" }));

	x = canvas.width / 2;
	y = 89 // pfp.height=128;

	ctx.fillStyle = "#FFFFFF";
	ctx.arc(x, y, 67, 0, 2 * Math.PI);
	ctx.fill();

	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, 64, 0, 2 * Math.PI);
	ctx.clip();

	x = canvas.width / 2 - 64;
	y = 25;

	ctx.drawImage(pfp, x, y, 128, 128);
	ctx.restore();

	ctx.font = "25px sans-serif";
	let text = `${member.user.tag} just joined the server`;
	x = canvas.width / 2 - ctx.measureText(text).width / 2;
	ctx.fillText(text, x, 198);

	ctx.fillStyle = "#B4B4B4";
	ctx.font = "22px sans-serif";
	text = `Member #${member.guild.memberCount}`;
	x = canvas.width / 2 - ctx.measureText(text).width / 2;
	ctx.fillText(text, x, 228);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer());

	let serverConfig = await serverConfigModel.findOne({ serverID: member.guild.id });
	const welcomeChannel = serverConfig.welcomeChannel
	const channel = member.guild.channels.cache.get(welcomeChannel);
	if (channel) channel.send(`Hey <@${member.user.id}>, welcome to our **${member.guild.name}**! Hope u enjoy here 🤗`, attachment);
}
