const { ButtonBuilder, ButtonStyle } = require('discord.js')
const Button = require('../../../source/structures/base/Button')

class Test extends Button {
  send() {
    return [
      new ButtonBuilder()
        .setCustomId('btn')
        .setLabel('Hallo')
        .setStyle(ButtonStyle.Primary),
    ]
  }

  /** @param {import('discord.js').ButtonInteraction} interaction */
  sendResponse(interaction) {
    interaction.reply('Halllo!')
  }
}

module.exports = Test
