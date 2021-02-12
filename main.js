// Bot Invite Link: https://discord.com/oauth2/authorize?client_id=807984309906046976&scope=bot&permissions=8

require("dotenv").config();
const StateManager = require('./src/utils/StateManager');
const Discord = require("discord.js");
const client = new Discord.Client();
const { registerCommands, registerEvents } = require("./src/utils/register");

(async () => {
  await client.login(process.env.BOT_TOKEN);
  client.commands = new Map();
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
})();
