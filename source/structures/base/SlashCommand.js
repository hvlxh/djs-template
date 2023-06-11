/**
 * @abstract
 */
class SlashCommand {
  /**
   *
   * @param {Omit<import('discord.js').ChatInputApplicationCommandData, "name" | "type">} options
   */
  constructor(options) {
    this.options = options
  }

  /**
   * @abstract
   * @param {{client: import('../../app');interaction: import('discord.js').CommandInteraction;options: Omit<import('discord.js').CommandInteractionOptionResolver, "getFocused" | "getMessage">;}} _options
   */
  // eslint-disable-next-line no-unused-vars
  run(_options) {}
}

module.exports = SlashCommand
