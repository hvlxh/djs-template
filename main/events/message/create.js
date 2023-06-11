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

    const match = message.content.match(/^\?(\S+)\s*([\s\S]*)$/)
    if (!match) return

    const [, rawCommand, ...args] = match
    const cmd = this.client.getPrefixCommands().find((v, k) => k === rawCommand)

    if (!cmd) return message.reply('Invalid command.')
    cmd.options.permissions?.member?.forEach((perm) => {
      if (!message.member?.permissionsIn(message.channelId).has(perm))
        return message.reply(
          "You didn't have permission to use this command. (`{}`)".replace(
            '{}',
            perm.toString()
          )
        )
    })

    cmd.options.permissions?.bot?.forEach(async (perm) => {
      if (
        !(await message.guild?.members.fetchMe())
          ?.permissionsIn(message.channelId)
          .has(perm)
      )
        return message.reply(
          "Bot didn't have permission to execute this command. (`{}`)".replace(
            '{}',
            perm.toString()
          )
        )
    })

    if (cmd.options.arguments.min <= args.length) {
      return message.reply(
        'Minimum arguments is {1} but received {2}'
          .replace('{1}', cmd.options.arguments.min.toString())
          .replace('{2}', args.length.toString())
      )
    }

    if (cmd.options.arguments.max >= args.length) {
      return message.reply(
        'Maximum arguments is {1} but received {2}'
          .replace('{1}', cmd.options.arguments.min.toString())
          .replace('{2}', args.length.toString())
      )
    }

    cmd.run({ message, client: this.client, options: args })
  }
}

module.exports = MessageCreate
