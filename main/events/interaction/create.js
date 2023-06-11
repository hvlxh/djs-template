const Event = require('../../../source/structures/base/Event')

class InteractionCreate extends Event {
  constructor() {
    super({})
  }

  /**
   *
   * @param {import('discord.js').Interaction} interaction
   */
  run(interaction) {
    if (interaction.isChatInputCommand()) {
      let commandName

      try {
        if (interaction.options.getSubcommandGroup()) {
          commandName = `${
            interaction.commandName
          }/${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}`
        } else {
          commandName = `${
            interaction.commandName
          }/${interaction.options.getSubcommand()}`
        }
      } catch {
        commandName = interaction.commandName
      }

      const command = this.client.getCommands().collection.get(commandName)
      if (!command)
        return interaction.reply({
          content: 'Command not found.',
          ephemeral: true,
        })

      command.run({
        interaction,
        client: this.client,
        options: interaction.options,
      })
    }

    if (interaction.isUserContextMenuCommand()) {
      const context = this.client.getUserContexts().get(interaction.commandName)
      if (!context)
        return interaction.reply({
          content: 'Command not found.',
          ephemeral: true,
        })

      context.run({
        interaction,
        client: this.client,
        options: interaction.options,
      })
    }

    if (interaction.isMessageContextMenuCommand()) {
      const context = this.client
        .getMessageContexts()
        .get(interaction.commandName)
      if (!context)
        return interaction.reply({
          content: 'Command not found.',
          ephemeral: true,
        })

      context.run({
        interaction,
        client: this.client,
        options: interaction.options,
      })
    }

    if (interaction.isModalSubmit()) {
      const modal = this.client.getModalsCollection().get(interaction.customId)
      if (!modal) return interaction.reply('No response available.')

      modal(interaction)
    }

    if (interaction.isButton()) {
      const button = this.client
        .getButtonsCollection()
        .get(interaction.customId)
      if (!button) return interaction.reply('No response available.')

      button(interaction)
    }
  }
}

module.exports = InteractionCreate
