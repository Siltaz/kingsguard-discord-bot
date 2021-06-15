const mongoose = require("mongoose");

const botChannelSchema = new mongoose.Schema({
  serverID: { type: String, require: true },
  channelID: { type: String, require: true, unique: true },
  botName: { type: String, require: true },
  prefixes: [{ type: String}],
});

const model = mongoose.model("bot_channels", botChannelSchema);
module.exports = model;