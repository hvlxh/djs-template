const SlashCommand = require('../../../../../source/structures/base/SlashCommand')

class ReloadEvents extends SlashCommand {
  constructor() {
    super({
      description: 'Reload the events.',
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
    await interaction.reply({ content: 'Reloading events...', ephemeral: true })
    console.info('cmd', 'Requested to reload events...\n\n')
    await client.loadEvents()
    console.info('cmd', 'reloaded events!')
    await interaction.editReply('Reloaded events!')
  }
}

module.exports = ReloadEvents
