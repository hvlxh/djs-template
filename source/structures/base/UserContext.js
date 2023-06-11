const { ApplicationCommandType } = require('discord.js')

/**
 * @abstract
 */
class UserContext {
  /**
   * @readonly
   * @type {Omit<import('discord.js').UserApplicationCommandData, "type">}
   */
  options

  /**
   *
   * @param {Omit<import('discord.js').UserApplicationCommandData, "type">} options
   */
  constructor(options) {
    this.options = options
    // @ts-ignore
    this.options.type = ApplicationCommandType.User
  }

  /**
   * @abstract
   * @param {{ client: import('../library/Client'), interaction: import('discord.js').UserContextMenuCommandInteraction, options: Omit<import('discord.js').CommandInteractionOptionResolver, "getFocused" | "getChannel" | "getSubcommand" | "getSubcommandGroup" | "getBoolean" | "getNumber" | "getInteger" | "getMentionable" | "getString" | "getRole"> }} _options
   */
  // eslint-disable-next-line no-unused-vars
  run(_options) {}
}

module.exports = UserContext
