const { ApplicationCommandType } = require('discord.js');


module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {import('../../structures/lib/Client')} client 
     */
    run: (client) => {
        client.logger.log('Client is Running!', ['CLIENT']);

        const all = [];
        client.commands.array.forEach((c) => all.push(c));
        client.contexts.array.forEach((c) => all.push(c))
        client.guilds.cache.get('985078714121482281').commands.set(all).then((cmds) => {
            cmds.each((c) => {
                if (c.type === ApplicationCommandType.Message) {
                    client.logger.log(`Loaded "${c.name}"`, ['CONTEXT_MESSAGE'])
                } else if (c.type === ApplicationCommandType.User) {
                    client.logger.log(`Loaded "${c.name}"`, ['CONTEXT_USER'])
                } else {
                    client.logger.log(`Loaded "${c.name}"`, ['SLASH'])
                }
            })
        });
    },
};