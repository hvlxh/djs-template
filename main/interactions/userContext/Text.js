const UserContext = require('../../../source/structures/base/UserContext')

class Text extends UserContext {
  constructor() {
    super({
      name: 'Text "hi"',
    })
  }

  /**
   * @abstract
   * @param {{ client: import('../../../source/structures/library/Client'), interaction: import('discord.js').UserContextMenuCommandInteraction, options: import('discord.js').CommandInteractionOptionResolver }} options
   */
  run({ interaction }) {
    interaction.reply('Hi')
  }
}

module.exports = Text
