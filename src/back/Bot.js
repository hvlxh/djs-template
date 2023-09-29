import { ApplicationCommandOptionType, ApplicationCommandType, Client, Collection } from 'discord.js';
import { glob } from 'glob';
import config from '../config.js';
import Logger from './Logger.js';
import { readdir } from 'fs/promises'
import { join } from 'path';

class Bot extends Client {
  /**
   * @private
   * @type {{
   *   collection: Collection<string, { default: () => any, info: import('discord.js').ChatInputApplicationCommandData}>,
   *   array: import('discord.js').ChatInputApplicationCommandData[]
   * }}
   */
  slashCommands;

  /**
   * @private
   * @type {Collection<string, () => any>}
   */
  contextMenus;

  /**
   * @private
   * @type {Collection<string, () => any>}
   */
  prefixCommands;

  /**
   * @private
   * @type {typeof config}
   */
  config = config;

  constructor() {
    super(config.clientOptions);

    this.slashCommands = {
      collection: new Collection(),
      array: [],
    };

    this.contextMenus = new Collection();
    this.prefixCommands = new Collection();
  }

  getConfig() {
    return this.config;
  }

  getSlashCommands() {
    return this.slashCommands;
  }

  getContextMenus() {
    return this.contextMenus;
  }

  getPrefixCommands() {
    return this.prefixCommands;
  }

  async loadAll() {
    await this.loadListeners();
    await this.loadSlashCommands();
    await this.loadContextMenus();
    await this.loadPrefixCommands();
  }

  async loadListeners() {
    const files = await glob('./src/front/listeners/**/*.js');

    files.forEach(async (path_) => {
      const path = path_.replace('src/front/listeners/', '');
      const splitted = path.split('/');

      splitted.forEach((_, i) => {
        if (i === 0) return;
        splitted[i] = splitted[i][0].toUpperCase() + splitted[i].substring(1);
      });

      const name = splitted.join('').replace('.js', '');
      const run = await import(`../front/listeners/${path}`);

      if (!run.default) throw new Error(`${name} doesn't have run function`);

      if (run.info?.once) {
        this.once(name, run.default);
      } else {
        this.on(name, run.default);
      }

      Logger.info(`"${name}" loaded`, 'Event');
    });
  }

  async loadSlashCommands() {
    const files = await readdir('./src/front/interactions/slash', {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isDirectory()) {
        const name = file.name.split('.')[0];
        const filesA = await readdir(
          `./src/front/interactions/slash/${file.name}`,
          { withFileTypes: true },
        );
        const cmdA = {
          name,
          description: 'No description provided',
          type: ApplicationCommandType.ChatInput,
          /** @type {import('discord.js').ApplicationCommandSubCommandData[] | import('discord.js').ApplicationCommandSubGroupData[]} */
          options: [],
        };

        for (const fileA of filesA) {
          if (fileA.isDirectory()) {
            const filesB = await readdir(
              `./src/front/interactions/slash/${file.name}/${fileA.name}`,
              {
                withFileTypes: true,
              },
            );
            const nameA = fileA.name.split('.')[0];
            const cmdB = {
              name: nameA,
              description: 'No description provided',
              type: ApplicationCommandOptionType.SubcommandGroup,
              options: [],
            };

            for (const fileB of filesB) {
              if (fileB.isFile()) {
                const nameB = fileB.name.split('.')[0];
                const cmdSubB = await import(
                  `../front/interactions/slash/${name}/${nameA}/${fileB.name}`
                );

                this.getSlashCommands().collection.set(
                  `${name}/${nameA}/${nameB}`,
                  cmdSubB.default,
                );
                cmdB.options.push({
                  ...cmdSubB.info,
                  type: ApplicationCommandOptionType.Subcommand,
                  name: nameB,
                });

                Logger.info(`"${name}/${nameA}/${nameB}" loaded`, 'Slash');
              } else {
                throw new Error('No 4th subcommand allowed in slash commands.');
              }
            }

            cmdA.options.push(cmdB);
          } else {
            const nameA = fileA.name.split('.')[0];
            const cmdSubA = await import(
              `../front/interactions/slash/${name}/${fileA.name}`
            );

            cmdA.options.push({
              ...cmdSubA.info,
              name: nameA,
              type: ApplicationCommandOptionType.Subcommand,
            });
            this.getSlashCommands().collection.set(
              [name, nameA].join('/'),
              cmdSubA.default,
            );

            Logger.info(`"${name}/${nameA}" loaded`, 'Slash');
          }
        }

        this.getSlashCommands().array.push(cmdA);
      } else {
        const cmd = await import(`../front/interactions/slash/${file.name}`);
        const name = file.name.split('.')[0];

        this.getSlashCommands().collection.set(name, cmd.default);
        this.getSlashCommands().array.push({
          name,
          ...cmd.info,
          type: ApplicationCommandType.ChatInput,
        });

        Logger.info(`"${name}" loaded`, 'Slash');
      }
    }
  }

  async loadContextMenus() {
    const files = await readdir('./src/front/interactions/context_menu', {
      withFileTypes: true,
    });
    for (const file of files) {
      if (!file.isFile())
        throw new Error('No subfiles in context_menu folder.');

      const ctx = await import(
        `../front/interactions/context_menu/${file.name}`
      );
      this.getSlashCommands().array.push({
        ...ctx.info,
        type:
          ctx.info.type === 'user'
            ? ApplicationCommandType.User
            : ApplicationCommandType.Message,
      });

      this.contextMenus.set(ctx.info.name, ctx.default);

      Logger.info(`"${ctx.info.name}" (${ctx.info.type}) loaded`, 'Context');
    }
  }

  async loadPrefixCommands() {
    const files = await glob('src/front/prefix/**/*.js');
    for (const file of files) {
      const cmd = await import(join('../../', file))

      this.prefixCommands.set(file.replace('src/front/prefix/', '').replaceAll('/', ' ').replace('.js',''), cmd)
    }
  }

  login(token) {
    this.loadAll().then(() => super.login(token));
  }
}

export default Bot;
