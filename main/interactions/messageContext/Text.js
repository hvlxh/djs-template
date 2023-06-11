const MessageContext = require('../../../source/structures/base/MessageContext')

class TextHi extends MessageContext {
  constructor() {
    super({
      name: 'Text "hi"',
    })
  }

  /**
   * @abstract
   * @param {{ client: import('../../../source/structures/library/Client'), interaction: import('discord.js').MessageContextMenuCommandInteraction, options: Omit<import('discord.js').CommandInteractionOptionResolver, "getFocused" | "getSubcommand" | "getSubcommandGroup" | "getBoolean" | "getNumber" | "getInteger" | "getMentionable" | "getString" | "getRole"> }} _options
   */
  run({ interaction }) {
    interaction.reply('Hi')
  }
}

module.exports = TextHi
