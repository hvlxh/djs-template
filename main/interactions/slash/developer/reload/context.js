const SlashCommand = require('../../../../../source/structures/base/SlashCommand')

class ReloadContext extends SlashCommand {
  constructor() {
    super({
      description: 'Reload the context.',
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
      content: 'Reloading context...',
      ephemeral: true,
    })
    console.info('cmd', 'Requested to reload context...\n\n')
    await client.loadUserContexts()
    await client.loadMessageContexts()
    console.info('cmd', 'reloaded context!')
    await interaction.editReply('Reloaded context!')
  }
}

module.exports = ReloadContext
