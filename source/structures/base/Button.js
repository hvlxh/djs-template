/**
 * @abstract
 */
class Button {
  /**
   * @abstract
   * @returns {import('discord.js').ButtonBuilder[]}
   */
  send() {}

  /**
   * @abstract
   * @param {import('discord.js').ButtonInteraction} _interaction
   * @returns {void | Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  sendResponse(_interaction) {}
}

module.exports = Button
