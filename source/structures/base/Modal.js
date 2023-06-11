/**
 * @abstract
 */
class Modal {
  /**
   * @abstract
   * @returns {import('discord.js').ModalBuilder}
   */
  send() {}

  /**
   * @abstract
   * @param {import('discord.js').ModalSubmitInteraction} _interaction
   * @returns {void | Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  sendResponse(_interaction) {}
}

module.exports = Modal
