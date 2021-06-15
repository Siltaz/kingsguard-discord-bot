module.exports = {
  name: 'help',
  async run(Discord, client, message, args) {
    const embed = new Discord.MessageEmbed()
      .setColor("#40e0d0")
      .setTitle("Available Commands:")
      .addFields({ name: "\`help\`", value: "displays help menu" })
      .addFields({ name: "\`chprefix <new_prefix>\`", value: "changes prefix" })
      .addFields({ name: "\`setwelcome <channel_id>\`", value: "sends welcome message when someone joins the server" })
      .addFields({ name: "\`setgoodbye <channel_id>\`", value: "sends goodbye message when somene leavs the server " });
    message.channel.send(embed);
  }
}
