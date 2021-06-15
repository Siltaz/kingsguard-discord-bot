const serverConfigModel = require('../models/serverConfig');
const roleChannelModel = require('../models/roleChannel');
const botChannelModel = require('../models/botChannel');

module.exports = {
    async run() {

        try {
            // await serverConfigModel.create({
            //     serverID: '715803043450454116',
            //     serverOwnerID: '300342784567803905',
            //     prefix: '?',
            //     welcomeChannel: '778506084398137396',
            //     goodbyeChannel: '767785684794474557'
            // })

            // await serverConfigModel.create({
            //     serverID: '753125748637696031',
            //     serverOwnerID: '388695217144070146',
            //     prefix: '.',
            //     welcomeChannel: '753126202104873080',
            //     goodbyeChannel: '806191483216330822'
            // })
        } catch (err) {
            console.log(err);
        }

        try {
            // await roleChannelModel.create({
            //     serverID: '806069675417927711',
            //     channelID: '800339243247468594',
            //     heading: 'WHO ARE YOU ?',
            //     reactions: [
            //         {
            //             role: 'Coder',
            //             emoji: '🧑‍💻'
            //         },
            //         {
            //             role: 'Gamer',
            //             emoji: '🎮'
            //         },
            //         {
            //             role: 'Member',
            //             emoji: '🙂'
            //         }
            //     ]
            // })
        } catch (err) {
            console.log(err);
        }

        try {
            // await botChannelModel.create({
            //     serverID: '753125748637696031',
            //     channelID: '801783032863260693',
            //     botName: 'music',
            //     prefixes: ['-',';',';;','>','!']
            // })
        } catch (err) {
            console.log(err);
        }
    }
}