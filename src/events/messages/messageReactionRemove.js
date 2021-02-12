const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");

module.exports = class MessageReactionRemoveEvent extends BaseEvent {
  constructor() {
    super("messageReactionRemove");
    this.connection = StateManager.connection;
  }

  async run(client, reaction, user) {
    if (user.bot) return;
    if (!reaction.message.guild) return;

    this.connection.query('SELECT * FROM role_channels WHERE channel_id=? AND guild_id=?', [reaction.message.channel.id, reaction.message.guild.id])
      .then(res1 => {
        if (!res1[0].length) return;
        this.connection.query('SELECT * FROM reaction_roles WHERE emoji LIKE ? AND role_channel_id=?', [reaction.emoji.name, res1[0][0].id])
          .then(res2 => {
            if (!res2[0].length) return;
            const role = reaction.message.guild.roles.cache.find(role => role.name === res2[0][0].role);
            const member = reaction.message.guild.members.cache.find(member => member.id === user.id);
            if (member == undefined || role == undefined) return;

            this.connection.query('SELECT * FROM reaction_roles WHERE category=? AND guild_id=?', [role.name, reaction.message.guild.id])
              .then(res3 => {
                res3[0].forEach(sr => {
                  const subrole = reaction.message.guild.roles.cache.find(role => role.name === sr.role);
                  if (subrole != undefined) member.roles.remove(subrole);
                });
              })
              .catch(err => console.log(err));
            member.roles.remove(role)
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
};
