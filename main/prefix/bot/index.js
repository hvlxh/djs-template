const { EmbedBuilder } = require('discord.js')
const PrefixCommand = require('../../../source/structures/base/PrefixCommand')

class BotCmd extends PrefixCommand {
  constructor() {
    super({
      description: 'Help command for "bot"',
      permissions: {
        bot: ['EmbedLinks'],
      },
      arguments: {
        min: 0,
        max: -1,
      },
    })
  }

  /**
   *
   * @abstract
   * @param {{ message: import('discord.js').Message; options: string[]; client: import('../../../source/structures/library/Client') }} _options
   */
  run({ message }) {
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Blue')
          .setTitle('"bot" Help Command')
          .setDescription('> `bot ping` - "Get the latency of the bot"'),
      ],
    })
  }
}

module.exports = BotCmd
