const firstMessage = require("./first-message");
const config = require("./config.json");
const roles = require("./roles.json");

module.exports = (client) => {
  const personReactions = [];
  const coderReactions = [];
  const gamerReactions = [];
  const getRoleName = (emoji) => {
    const role = roles.find((role) => role.emoji === emoji);
    if (role == undefined) return;
    else return role.name;
  };

  // First Message
  let personText = ">>> \n**WHO ARE YOU ?**\n\n";
  roles.forEach((role) => {
    if (role.type != "Person") return;
    personReactions.push(role.emoji);
    personText += `${role.emoji} : \`${role.name}\`\n\n`;
  });

  // Coder Roles
  let coderText = ">>> \n**YOUR PREFERRED CODING LANGUAGE ?**\n\n";
  roles.forEach((role) => {
    if (role.type != "Coder") return;
    coderReactions.push(role.emoji);
    coderText += `${role.emoji} : \`${role.name}\`\n\n`;
  });

  // Gamer Roles
  let gamerText = ">>> \n**WHICH GAMES DO YOU PLAY ?**\n\n";
  roles.forEach((role) => {
    if (role.type != "Gamer") return;
    gamerReactions.push(role.emoji);
    gamerText += `${role.emoji} : \`${role.name}\`\n\n`;
  });

  firstMessage(client, config.rules_channel, personText, personReactions);
  firstMessage(client, config.coder_roles_channel, coderText, coderReactions);
  firstMessage(client, config.gamer_roles_channel, gamerText, gamerReactions);

  const handleReaction = (reaction, user, isAdding) => {
    if (user.bot) return;
    if (!reaction.message.guild) return;
    const { guild } = reaction.message;

    const role = guild.roles.cache.find(
      (role) => role.name === getRoleName(reaction._emoji.name)
    );
    const member = guild.members.cache.find((member) => member.id === user.id);

    if (role == undefined) {
      reaction.remove();
      return;
    }

    if (member == undefined) return;

    if (isAdding) member.roles.add(role);
    else {
      if (["Gamer", "Coder"].includes(role.name)) {
        roles.forEach((r) => {
          if (r.type != role.name) return;
          const subrole = guild.roles.cache.find(
            (role) => role.name === r.name
          );
          member.roles.remove(subrole);
        });
      }

      member.roles.remove(role);
    }
  };

  client.on("messageReactionAdd", (reaction, user) => {
    if (config.role_channels.includes(reaction.message.channel.id))
      handleReaction(reaction, user, true);
  });

  client.on("messageReactionRemove", (reaction, user) => {
    if (config.role_channels.includes(reaction.message.channel.id))
      handleReaction(reaction, user, false);
  });
};
