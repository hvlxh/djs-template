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

    const raw = message.content.substring(prefixUsed.length).trim()

    const cmd = this.client.getPrefixCommands().find((v, k) => k === raw)
    if (!cmd) return message.reply('Invalid command.')
    const key = raw
    const args = message.content.substring(key?.length).split(' ').slice(1)

    cmd.options.permissions?.member?.forEach((perm) => {
      if (!message.member?.permissionsIn(message.channelId).has(perm))
        return message.reply(
          `You didn't have permission to use this command. (\`${perm}\`)`
        )
    })

    cmd.options.permissions?.bot?.forEach(async (perm) => {
      if (
        !(await message.guild?.members.fetchMe())
          ?.permissionsIn(message.channelId)
          .has(perm)
      )
        return message.reply(
          `I didn't have permission to execute this command. (\`${perm}\`)`
        )
    })

    if (cmd.options.arguments?.min < args.length) {
      return message.reply(
        `Minimum arguments is \`${cmd.options.arguments.min}\`, received \`${args.length}\``
      )
    }

    if (cmd.options.arguments?.max < args.length) {
      return message.reply(
        `Maximum arguments is \`${cmd.options.arguments.max}\`, received \`${args.length}\``
      )
    }

    cmd.run({ message, client: this.client, options: args })
  }
}

module.exports = MessageCreate
