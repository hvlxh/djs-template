const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js')
const Modal = require('../../../source/structures/base/Modal')

class Test extends Modal {
  send() {
    const input = new TextInputBuilder()
      .setCustomId('t-input')
      .setLabel('Type something')
      .setMinLength(3)
      .setPlaceholder('Hi')
      .setRequired(true)
      .setStyle(TextInputStyle.Short)

    return (
      new ModalBuilder()
        .setCustomId('t')
        .setTitle('Text me something...')
        // @ts-ignore
        .addComponents(new ActionRowBuilder().setComponents(input))
    )
  }

  /**
   *
   * @param {import('discord.js').ModalSubmitInteraction} interaction
   * @returns {void}
   */
  sendResponse(interaction) {
    const input = interaction.fields.getTextInputValue('t-input')
    interaction.reply(input)
  }
}

module.exports = Test
