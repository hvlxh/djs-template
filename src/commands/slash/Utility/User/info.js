const { SlashCommand } = require('discord-commands-params');
const { ApplicationCommandOptionType, EmbedBuilder, time } = require('discord.js');

module.exports = new SlashCommand({
    name: 'info',
    description: 'Get the user information',
    options: [{
        name: 'target',
        description: 'Provide an member.',
        type: ApplicationCommandOptionType.User,
        required: false,
    }],
    run: async ({ client, interaction, options }) => {
        const target = options.getMember('target') || interaction.member;
        const { user, roles } = target;

        await user.fetch();

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(target.displayHexColor)
                    .setTitle('Userinfo - ' + user.tag)
                    .setThumbnail(user.displayAvatarURL({ size: 1024 }))
                    .setDescription(`
Name: ${target.displayName}(\`${user.tag}\`)
> ID: \`${target.id}\`               
> Discriminator: ${user.dicriminator}
Created At: ${time(user.createdAt, 'R')}
Joined At: ${time(target.joinedAt, 'R')}
                `)
            ],
        });
    },
});