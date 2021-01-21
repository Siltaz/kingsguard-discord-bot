// Bot Invite Link: https://discord.com/oauth2/authorize?client_id=801828395117445231&scope=bot&permissions=8

const fs = require("fs");
const Discord = require("discord.js");
require("dotenv").config();
const config = require("./config.json");

const bot = new Discord.Client();
const prefix = process.env.PREFIX;

bot.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

bot.once("ready", () => {
  console.log("King's Guard has Awaken 🔥");
  bot.user.setActivity(`${prefix}help`, { type: "LISTENING" });
});

bot.on("message", (message) => {
  if (!message.author.bot) {
    // Handles own commands
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).split(/ +/);
      const command = args.shift().toLowerCase();

      if (command === "help") bot.commands.get("help").execute(message, args);
    } else {
      // Keeps other bot channels clean
      let channel = config.bot_channels.find(
        (channel) => channel.id == message.channel.id
      );

      if (channel != undefined) {
        if (!message.content.startsWith(channel.prefix)) message.delete();
        // message.delete();
      }
    }
  }
});

bot.login(process.env.DISCORD_TOKEN);
