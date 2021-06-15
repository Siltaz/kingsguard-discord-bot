const Discord = require('discord.js');

module.exports = (channel, message, type) => {
    let color;
    switch (type) {
        case "ERROR": color = '#DC143C';
            break;
        case "SUCCESS": color = '#008000';
            break;
        default: color = '#40e0d0';
    }
    const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(message);
    channel.send(embed);
}