module.exports = {
    name: 'Userinfo',
    type: 'msg',
    /**
     * 
     * @param {import('../../../structures/lib/Client')} client 
     * @param {import('discord.js').MessageContextMenuCommandInteraction} interaction 
     * @param {import('discord.js').CommandInteractionOptionResolver} options 
     */
    run: (client, interaction, options) => {
        interaction.reply('yep');
    },
};