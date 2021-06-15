const mongoose = require("mongoose");

const serverConfigSchema = new mongoose.Schema({
  serverID: { type: String, require: true, unique: true },
  serverOwnerID: { type: String, require: true },
  prefix: { type: String, default: '?' },
  welcomeChannel: { type: String },
  goodbyeChannel: { type: String }
});

const model = mongoose.model("server_configs", serverConfigSchema);
module.exports = model;