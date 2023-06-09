const { EmbedBuilder } = require('discord.js')
const SlashCommand = require('../../../../source/structures/base/SlashCommand')

class TestCommand extends SlashCommand {
  constructor() {
    super({
      description: 'Test command.',
    })
  }

  /**
   *
   * @param {{
   *   interaction: import('discord.js').CommandInteraction;
   *   client: import('../../../../source/app')
   * }} param0
   */
  async run({ interaction, client }) {
    const message = await interaction.reply({
      content: 'Pinging...',
      fetchReply: true,
    })
    const data = [
      `Latency: \`${Date.now() - message.createdTimestamp}\`ms`,
      `API Latency: \`${client.ws.ping}\`ms`,
    ]

    await interaction.editReply({
      content: '',
      embeds: [
        new EmbedBuilder()
          .setColor('DarkButNotBlack')
          .setTitle('Pong!')
          .setDescription(data.map((v) => '> ' + v).join('\n')),
      ],
    })
  }
}

module.exports = TestCommand
