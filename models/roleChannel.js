const mongoose = require("mongoose");

const roleChannelSchema = new mongoose.Schema({
  serverID: { type: String, require: true },
  channelID: { type: String, require: true, unique: true },
  heading: { type: String, require: true },
  reactions: [{
    role: { type: String, require: true },
    emoji: { type: String, require: true }
  }]
});

const model = mongoose.model("role_channels", roleChannelSchema);
module.exports = model;