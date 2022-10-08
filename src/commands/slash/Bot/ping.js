const { SlashCommand } = require('discord-commands-params');

module.exports = new SlashCommand({
    name: 'ping',
    description: 'Check the bot ping.',
    run: ({ client, interaction, options }) => {
        interaction.reply('Done');
    },
});