const roleChannelModel = require('../../models/roleChannel');

module.exports = async (Discord, client, reaction, user) => {
    if (user.bot) return;
    if (!reaction.message.guild) return;

    let roleChannel = await roleChannelModel.findOne({ channelID: reaction.message.channel.id, serverID: reaction.message.guild.id });
    if (!roleChannel) return;

    reactionRole = roleChannel.reactions.find(r => r.emoji == reaction.emoji.name);
    if (!reactionRole) {
        reaction.users.remove(user.id);
        return;
    }

    const role = reaction.message.guild.roles.cache.find(role => role.name === reactionRole.role);
    const member = reaction.message.guild.members.cache.find(member => member.id === user.id);

    if (member == undefined) return;
    if (role == undefined) {
        reaction.users.remove(user.id);
        return;
    }

    member.roles.add(role)
}
