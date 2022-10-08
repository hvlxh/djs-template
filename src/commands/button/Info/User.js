const { ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    id: 'utility:server:info-features',
    register: new ButtonBuilder()
        .setCustomId('utility:server:info-features')
        .setLabel('Features')
        .setStyle(ButtonStyle.Primary),
    /**
     * 
     * @param {import('../../../structures/lib/Client')} client 
     * @param {import('discord.js').ButtonInteraction} interaction 
     */
    response: (client, interaction) => {
        const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };
        const Embed = new EmbedBuilder()
            .setTitle('Guild Features')
            .setDescription(interaction.guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None")


        interaction.reply({
            embeds: [Embed],
            ephemeral: true,
        });
    },
};