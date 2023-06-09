const SlashCommand = require('../../../../../source/structures/base/SlashCommand')

class ReloadCommands extends SlashCommand {
  constructor() {
    super({
      description: 'Reload the commands.',
    })
  }

  /**
   *
   * @param {{
   *   interaction: import('discord.js').CommandInteraction;
   *   client: import('../../../../../source/app')
   * }} param0
   */
  async run({ interaction, client }) {
    await interaction.reply({
      content: 'Reloading commands...',
      ephemeral: true,
    })
    console.info('cmd', 'Requested to reload commands...\n\n')
    await client.loadSlashCommands()
    console.info('cmd', 'reloaded commands!')
    await interaction.editReply('Reloaded commands!')
  }
}

module.exports = ReloadCommands
