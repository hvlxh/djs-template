const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    id: 'example',
    register: new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('example')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Example'),
    ),
    /**
      *
      * @param {import('../../structures/lib/DiscordClient')} client
      * @param {import('discord.js').ButtonInteraction} interaction
      */
    response: (client, interaction) => {
    },
};