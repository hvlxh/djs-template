const { SlashCommand } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = new SlashCommand({
    name: 'example',
    description: 'Example Description',
    options: [{
        name: 'example_option',
        description: 'Example option description',
        type: ApplicationCommandOptionType.String,
        required: false,
    }],
    run: ({ client, interaction, options }) => {

    },
});