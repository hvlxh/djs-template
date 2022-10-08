module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     * @param {import('../../structures/lib/Client')} client 
     */
    run: async (interaction, client) => {
        if (interaction.isChatInputCommand()) {
            const subcmd_group = interaction.options.getSubcommandGroup();
            const subcmd = interaction.options.getSubcommand();
            let string;

            if (subcmd_group) {
                string = `${interaction.commandName}/${subcmd_group}/${subcmd}`;
            } else {
                string = `${interaction.commandName}/${subcmd}`;
            }

            const cmd = client.commands.collection.get(string);
            if (!cmd)
                return await interaction.reply({
                    content: 'This slash command is outdated',
                    ephemeral: true,
                })

            const options = interaction.options;
            cmd.run({ client, interaction, options });
        }

        if (interaction.isContextMenuCommand()) {
            const ctx = client.contexts.collection.get(interaction.commandName);

            if (!ctx)
                return await interaction.reply({
                    content: 'This context command is outdated',
                    ephemeral: true,
                });

            ctx.run(client, interaction, interaction.options);
        }

        if (interaction.isButton()) {
            const btn = client.buttons.get(interaction.customId);

            if (!btn)
                return await interaction.reply({
                    content: 'This button command is outdated',
                    ephemeral: true,
                });

            btn.response(client, interaction);
        }

        if (interaction.isModalSubmit()) {
            const mod = client.modals.get(interaction.customId);

            if (!mod)
                return await interaction.reply({
                    content: 'This modal is outdated',
                    ephemeral: true,
                });

            if (mod.isCollector) return;

            mod.response(client, interaction, interaction.options);
        }
    },
};