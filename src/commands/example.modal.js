const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    id: 'example',
    register: new ModalBuilder()
        .setCustomId('example')
        .setTitle('Example Modal')
        .setComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setStyle(TextInputStyle.Paragraph)
                    .setLabel('Reason')
                    .setPlaceholder('jo mama')
                    .setRequired(true)
                    .setCustomId('example')
            ),
        ),
    /**
      *
      * @param {import('../../structures/lib/DiscordClient')} client
      * @param {import('discord.js').ButtonInteraction} interaction
      */
    response: (client, interaction) => {
    },
};