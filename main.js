// Bot Invite Link: https://discord.com/oauth2/authorize?client_id=801828395117445231&scope=bot&permissions=8

const fs = require("fs");
const Discord = require("discord.js");
const { CanvasSenpai } = require("canvas-senpai");
const canva = new CanvasSenpai();
const config = require("./config.json");
const roleClaim = require("./role-claim");

require("dotenv").config();

const bot = new Discord.Client();
const prefix = process.env.PREFIX;
bot.commands = new Discord.Collection();

// Loads all the command files
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));

// Sets all loaded commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

// Waking up the Bot
bot.once("ready", () => {
  console.log("King's Guard has Awaken 🔥");
  bot.user.setActivity(`${prefix}info`, { type: "LISTENING" });
  roleClaim(bot);
});

// Welcome Message & Role to new Members
bot.on("guildMemberAdd", async (member) => {
  let data = await canva.welcome(member, {
    link: config.welcome_banner,
  });
  const attachment = new Discord.MessageAttachment(data);

  member.guild.channels.cache
    .get(config.welcome_channel)
    .send(
      `Hey <@${member.user.id}>, welcome to our **${
        member.guild.name
      }**! Please make sure to read ${member.guild.channels.cache
        .get(config.rules_channel)
        .toString()}`,
      attachment
    );
});

// Handles any incoming message
bot.on("message", (message) => {
  if (!message.author.bot) {
    // Checks for own prefix - Handles own commands
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).split(/ +/);
      const command = args.shift().toLowerCase();

      if (command === "info") bot.commands.get("info").execute(message, args);
      else {
        const newEmbed = new Discord.MessageEmbed()
          .setColor("#DC143C")
          .setTitle("I didn't get it 🤔")
          .setDescription("Invalid command !!")
          .addFields({ name: "Available Commands:", value: "info" });
        message.channel.send(newEmbed);
        message.delete();
      }
    } else {
      // Keeps other bot channels clean
      let channel = config.bot_channels.find(
        (channel) => channel.id == message.channel.id
      );

      const isThisMessageAllowed = (message, prefixes) => {
        let isAllowed = false;
        for (const prefix of prefixes) {
          isAllowed = message.content.startsWith(prefix);
          if (isAllowed) break;
        }
        return isAllowed;
      };

      // Checks if message appeared bots channel or not
      if (channel != undefined) {
        if (!isThisMessageAllowed(message, channel.prefixes)) {
          // Sends warning message
          const newEmbed = new Discord.MessageEmbed()
            .setColor("#FF8C00")
            .setTitle("This message doesn't belong here")
            .setDescription(
              `Only \`${channel.name} bot\` commands are allowed here !!`
            );
          message.channel.send(newEmbed);

          // Deletes the original message
          message.delete();
        }
      }
    }
  }
});

bot.login(process.env.DISCORD_TOKEN);
