// Bot Invite Link: https://discord.com/oauth2/authorize?client_id=801828395117445231&scope=bot&permissions=8

const fs = require("fs");
const Discord = require("discord.js");
const path = require("path");
const Canvas = require("canvas");
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

// Leave Members
bot.on("guildMemberRemove", (member) => {
  member.guild.channels.cache
    .get(config.leave_channel)
    .send(`<@${member.user.id}> has left the server!`);
});

// Welcome Message & Role to new Members
bot.on("guildMemberAdd", async (member) => {
  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    path.join(__dirname, "./assets/banner.jpg")
  );

  let x = 0;
  let y = 0;
  ctx.drawImage(background, x, y);

  const pfp = await Canvas.loadImage(
    member.user.displayAvatarURL({
      format: "png",
    })
  );

  x = canvas.width / 2;
  y = 25 + pfp.height / 2;

  ctx.fillStyle = "#FFFFFF";
  ctx.arc(x, y, (pfp.width+6) / 2, 0, 2 * Math.PI);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, pfp.width / 2, 0, 2 * Math.PI);
  ctx.clip();

  x = canvas.width / 2 - pfp.width / 2;
  y = 25;
  ctx.drawImage(pfp, x, y);
  ctx.restore();

  ctx.font = "28px sans-serif";
  let text = `${member.user.tag} just joined the server`;
  x = canvas.width / 2 - ctx.measureText(text).width / 2;
  ctx.fillText(text, x, 70 + pfp.height);

  ctx.fillStyle = "#B4B4B4";
  ctx.font = "22px sans-serif";
  text = `Member #${member.guild.memberCount}`;
  x = canvas.width / 2 - ctx.measureText(text).width / 2;
  ctx.fillText(text, x, 100 + pfp.height);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer());

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
