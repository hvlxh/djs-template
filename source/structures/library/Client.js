const path = require('path')
const { join } = require('path')
const {
  Client: Bot,
  Collection,
  ApplicationCommandOptionType,
} = require('discord.js')
const EventsLoader = require('../loaders/Events')
const fs = require('fs/promises')
class Client extends Bot {
  /**
   * @readonly
   * @private
   * @type {import('../../types/Configuration').Configuration}
   */
  config

  /**
   * @readonly
   * @private
   * @type {{ array: any[], collection: Collection<string, import('../base/SlashCommand')> }}
   */
  commands

  /**
   * @readonly
   * @private
   * @type {{user: Collection<string, import('../base/UserContext')>, message: Collection<string, import('../base/MessageContext')>}}
   */
  context

  /**
   * @readonly
   * @private
   * @type {{ collection: Collection<string, (interaction: import('discord.js').ModalSubmitInteraction) => void | Promise<void>>; modals: any }}
   */
  modal

  /**
   * @readonly
   * @private
   * @type {{ collection: Collection<string, (interaction: import('discord.js').ButtonInteraction) => void | Promise<void>>; btns: any }}
   */
  button

  /**
   * @readonly
   * @private
   * @type {import('discord.js').Collection<string, import('../base/PrefixCommand')>}
   */
  prefix = new Collection()

  /**
   *
   * @param {import('../../types/Configuration').Configuration} config
   */
  constructor(config) {
    super({
      intents: config.intents,
    })

    this.config = config
    this.commands = {
      array: [],
      collection: new Collection(),
    }

    this.context = {
      user: new Collection(),
      message: new Collection(),
    }

    this.modal = {
      modals: {},
      collection: new Collection(),
    }

    this.button = {
      btns: {},
      collection: new Collection(),
    }
  }

  getConfig() {
    return this.config
  }

  getModals() {
    return this.modal.modals
  }

  getModalsCollection() {
    return this.modal.collection
  }

  getButtons() {
    return this.button.btns
  }

  getButtonsCollection() {
    return this.button.collection
  }

  getCommands() {
    return this.commands
  }

  getUserContexts() {
    return this.context.user
  }

  getMessageContexts() {
    return this.context.message
  }

  getPrefixCommands() {
    return this.prefix
  }

  async loadEvents() {
    const files = EventsLoader('./main/events')

    files.forEach(async (file) => {
      const Event = require(`${process.cwd()}/${file.path}`)
      const event = new Event()

      if (event.options.once) {
        this.once(file.name, (...args) => event.run(...args))
      } else {
        this.on(file.name, (...args) => event.run(...args))
      }

      console.info(
        'evt',
        `${
          event.options.nick
            ? `"${file.name}" (${event.options.nick})`
            : `"${file.name}"`
        } loaded`
      )
    })
  }

  async loadSlashCommands() {
    const dir = './main/interactions/slash'
    const files = await fs.readdir(dir, { withFileTypes: true })
    for (const file of files) {
      const filePath = path.join(dir, file.name)
      if (file.isDirectory()) {
        try {
          await fs.access(filePath, fs.constants.R_OK)
          const subOptions = []

          const subFiles = await fs.readdir(filePath, {
            withFileTypes: true,
          })

          for (const subFile of subFiles) {
            if (!subFile.isDirectory()) {
              const SubCommand = require(path.join(
                '../../../',
                filePath,
                subFile.name
              ))
              const subCommand = new SubCommand()

              subCommand.options.type = ApplicationCommandOptionType.Subcommand
              subCommand.options.name = subFile.name
                .toLowerCase()
                .replace('.js', '')
              subOptions.push(subCommand.options)

              this.commands.collection.set(
                `${file.name}/${subCommand.options.name}`,
                subCommand
              )

              console.info(
                'cmd',
                `"${file.name}/${subCommand.options.name}" loaded`
              )
            } else {
              const subCommandGroupOptions = await this.listSubFiles(
                path.join(filePath, subFile.name)
              )

              if (subCommandGroupOptions.length > 0) {
                const subCommandGroup = {
                  name: subFile.name.toLowerCase(),
                  description: 'No description provided.',
                  type: ApplicationCommandOptionType.SubcommandGroup,
                  options: subCommandGroupOptions,
                }

                subOptions.push(subCommandGroup)
              }
            }
          }

          const cmd = {
            name: file.name.toLowerCase(),
            description: 'No description provided.',
            type: ApplicationCommandOptionType.Subcommand,
            options: subOptions,
          }

          this.commands.array.push(cmd)
        } catch (error) {
          console.error(`Unable to access directory: ${filePath}`)
          throw error
        }
      } else {
        const Command = require(path.join('../../../', filePath))
        const cmd = new Command()

        cmd.options.name = file.name.toLowerCase().replace('.js', '')
        this.commands.collection.set(cmd.options.name, cmd)
        this.commands.array.push(cmd.options)

        console.info('cmd', `"${cmd.options.name}" loaded`)
      }
    }
  }

  /**
   * @private
   * @param {string} dir
   * @returns {Promise<any[]>}
   */
  async listSubFiles(dir) {
    const subFiles = await fs.readdir(dir, { withFileTypes: true })
    const subOptions = []

    for (const subFile of subFiles) {
      if (!subFile.isDirectory()) {
        const SubCommand = require(path.join('../../../', dir, subFile.name))
        const subCommand = new SubCommand()

        subCommand.options.type = ApplicationCommandOptionType.Subcommand
        subCommand.options.name = subFile.name.toLowerCase().replace('.js', '')
        subOptions.push(subCommand.options)

        console.info(
          'cmd',
          `"${path
            .join(dir.replace('main\\interactions\\slash\\', ''), subFile.name)
            .replaceAll('\\', '/')
            .replace('.js', '')}" loaded`
        )
      }
    }

    return subOptions
  }

  async loadUserContexts() {
    const files = await fs.readdir('main/interactions/userContext', {
      withFileTypes: true,
    })
    for (const file of files) {
      if (!file.isFile())
        throw new Error("UserContext doesn't support sub-files")
      const UserContext = require(`../../../main/interactions/userContext/${file.name}`)
      /** @type {import('../base/UserContext')} */
      const context = new UserContext()

      this.commands.array.push(context.options)
      this.context.user.set(context.options.name, context)

      console.info('ctx', `User Context "${context.options.name}" loaded`)
    }
  }

  async loadMessageContexts() {
    const files = await fs.readdir('main/interactions/messageContext', {
      withFileTypes: true,
    })
    for (const file of files) {
      if (!file.isFile())
        throw new Error("MessageContext doesn't support sub-files")
      const MessageContext = require(`../../../main/interactions/messageContext/${file.name}`)
      /** @type {import('../base/MessageContext')} */
      const context = new MessageContext()

      this.commands.array.push(context.options)
      this.context.message.set(context.options.name, context)

      console.info('ctx', `Message Context "${context.options.name}" loaded`)
    }
  }

  async loadEventsOld() {
    const files = await fs.readdir('./main/events-old', { withFileTypes: true })
    for (const file of files) {
      if (!file.isFile())
        throw new Error('Sub-files are not supported on events-old.')
      const Event = require(path.join('../../../main/events-old', file.name))
      const event = new Event()

      if (event.options.once)
        this.once(event.options.name, (...args) => event.run(...args))
      else this.on(event.options.name, (...args) => event.run(...args))

      console.info('evt', `"${event.options.name}" loaded (Old)`)
    }
  }

  async loadModals() {
    const files = await fs.readdir('./main/interactions/modal')
    for (const file of files) {
      const Modal = require(path.join('../../../main/interactions/modal', file))
      /** @type {import('../base/Modal')}*/
      const modal = new Modal()

      // @ts-ignore
      this.modal.modals[modal.send().data.custom_id] = modal.send()
      // @ts-ignore
      this.modal.collection.set(modal.send().data.custom_id, modal.sendResponse)
    }
  }

  async loadButtons() {
    const files = await fs.readdir('./main/interactions/button')
    for (const file of files) {
      const Button = require(path.join(
        '../../../main/interactions/button',
        file
      ))
      /** @type {import('../base/Button')}*/
      const btn = new Button()

      // @ts-ignore
      btn.send().forEach((d) => {
        // @ts-ignore
        this.button.btns[d.data.custom_id] = btn.send()
        // @ts-ignore
        this.button.collection.set(d.data.custom_id, btn.sendResponse)
      })
    }
  }

  /**
   *
   * @param {string} folderPath
   * @param {string} prefix
   */
  async loadPrefixCommands(folderPath, prefix = '') {
    const files = await fs.readdir(folderPath, { withFileTypes: true })

    for (const file of files) {
      const filePath = path.join(folderPath, file.name)
      const fileName = file.name.replace('.js', '')

      if (file.isDirectory()) {
        await this.loadPrefixCommands(filePath, `${prefix}${fileName} `)
      } else {
        const name =
          fileName.toLowerCase() === 'index' ? prefix : prefix + fileName
        const cmd = new (require(join(process.cwd(), filePath)))()

        this.prefix.set(name, cmd)
      }
    }
  }

  async start() {
    await this.loadEvents()
    await this.loadEventsOld()
    await this.loadPrefixCommands('main/prefix')
    await this.loadSlashCommands()
    await this.loadUserContexts()
    await this.loadMessageContexts()
    await this.loadModals()
    await this.loadButtons()

    this.login(process.env.TOKEN)
  }
}

module.exports = Client
