module.exports = {
  name: "info",
  description: "This is info command!",
  execute(message, args) {
    message.channel.send(
      "I'm here to protect your Kingdom from unwanted gossips ⚔️"
    );
  },
};
