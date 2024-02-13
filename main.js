// Dev Bot Invite Link: https://discord.com/oauth2/authorize?client_id=807984309906046976&scope=bot&permissions=8
// Prod Bot Invite Link: https://discord.com/oauth2/authorize?client_id=801828395117445231&scope=bot&permissions=8

require("dotenv").config();

const mongoose = require('mongoose')
const Discord = require("discord.js");
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
  require(`./handlers/${handler}`)(Discord, client);
})

mongoose.connect(process.env.MONGODB_SRV)
  .then(() => console.log('Connected to database.'))
  .catch(err => console.log(err));

client.login(process.env.BOT_TOKEN);