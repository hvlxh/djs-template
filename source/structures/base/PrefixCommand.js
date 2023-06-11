/**
 * @abstract
 */
class PrefixCommand {
  /**
   *
   * @param {{
   *  description: string;
   *  aliases?: string[];
   *  permissions?: {
   *    bot?: import('discord.js').PermissionResolvable[];
   *    member?: import('discord.js').PermissionResolvable[]
   *  };
   *  arguments: {
   *    min: number;
   *    max: number | -1;
   *  }
   * }} options
   */
  constructor(options) {
    this.options = options
  }

  /**
   *
   * @abstract
   * @param {{ message: import('discord.js').Message; options: string[]; client: import('../../../source/structures/library/Client') }} _options
   */
  // eslint-disable-next-line no-unused-vars
  run(_options) {}
}

module.exports = PrefixCommand
