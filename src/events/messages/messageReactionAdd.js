const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");

module.exports = class MessageReactionAddEvent extends BaseEvent {
    constructor() {
        super("messageReactionAdd");
        this.connection = StateManager.connection;
    }

    async run(client, reaction, user) {
        if (user.bot) return;
        if (!reaction.message.guild) return;

        this.connection.query('SELECT * FROM role_channels WHERE channel_id=? AND guild_id=?', [reaction.message.channel.id, reaction.message.guild.id])
            .then(result1 => {
                if (!result1[0].length) return;
                this.connection.query("SELECT * FROM reaction_roles WHERE emoji LIKE ? AND role_channel_id=?", [reaction.emoji.name, result1[0][0].id])
                    .then(result2 => {
                        if (!result2[0].length) {
                            reaction.users.remove(user.id);
                            return;
                        }
                        const role = reaction.message.guild.roles.cache.find(role => role.name === result2[0][0].role);
                        const member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                        if (member == undefined) return;
                        if (role == undefined) {
                            reaction.users.remove(user.id);
                            return;
                        }

                        member.roles.add(role)
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }
};
