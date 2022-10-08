const { SlashCommand } = require('discord-commands-params');
const {
    EmbedBuilder,
    ChannelType,
    GuildVerificationLevel,
    GuildExplicitContentFilter,
    GuildNSFWLevel,
    ActionRowBuilder,
    userMention,
    time
} = require("discord.js");

module.exports = new SlashCommand({
    name: 'info',
    description: 'Get the server info',
    run: async ({ client, interaction, options }) => {
        const { guild } = interaction;
        const {
            channels
        } = guild;

        const owner = await guild.fetchOwner();

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Serverinfo - ' + guild.name)
                    .setColor(owner.displayHexColor)
                    .setAuthor({
                        name: owner.user.tag,
                        iconURL: owner.displayAvatarURL({ size: 1024 }),
                    }).setTimestamp(guild.createdAt)
                    .setDescription(`Name: ${guild.name}
ID: \`${guild.id}\`                
Owner: ${userMention(owner.id)}
Created At: ${time(guild.createdAt)}
                `)
            ],
            components: [
                new ActionRowBuilder().addComponents(client.buttons.get('utility:server:info-features').register),
            ],
        });
    },
});