const PrefixCommand = require('../../../source/structures/base/PrefixCommand')

class BotCmd extends PrefixCommand {
  constructor() {
    super({
      description: 'Get the bot latency',
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
    message.reply('Pong!')
  }
}

module.exports = BotCmd
