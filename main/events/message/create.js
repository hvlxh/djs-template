const Event = require('../../../source/structures/base/Event')

class MessageCreate extends Event {
  constructor() {
    super({})
  }

  /**
   *
   * @param {import('discord.js').Message} message
   */
  run(message) {
    const prefixUsed = this.client
      .getConfig()
      .defaultPrefixes.find((prefix) => message.content.startsWith(prefix))

    if (!prefixUsed) return

    const raw = message.content.substring(prefixUsed.length)

    const cmd = this.client
      .getPrefixCommands()
      .find((v, k) => k.startsWith(raw))
    if (!cmd) return message.reply('Invaild command.')
    const key = this.client
      .getPrefixCommands()
      .findKey((v, k) => k.startsWith(raw))
    if (!key) return message.reply('Invaild command.')

    const args = message.content.substring(key?.length).split(' ').slice(1)
    cmd.run({ message, client: this.client, options: args })
  }
}

module.exports = MessageCreate
