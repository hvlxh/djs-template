import client from '../../../app.js';
import ListenerRun from '../../../back/base/ListenerRun.js';

export default ListenerRun('interactionCreate', (interaction) => {
  if (interaction.isChatInputCommand()) {
    let commandName;

    try {
      if (interaction.options.getSubcommandGroup()) {
        commandName = `${
          interaction.commandName
        }/${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}`;
      } else {
        commandName = `${
          interaction.commandName
        }/${interaction.options.getSubcommand()}`;
      }
    } catch {
      commandName = interaction.commandName;
    }

    const command = client.getSlashCommands().collection.get(commandName);
    if (!command)
      return interaction.reply({
        content: 'Command not found.',
        ephemeral: true,
      });

    command({
      interaction,
      client,
      bot: client,
      options: interaction.options,
    });
  }

  if(interaction.isContextMenuCommand()) {
    const cmd = client.getContextMenus().get(interaction.commandName)

    if(!cmd) return interaction.reply({
      content: "Command Not Found.",
      ephemeral: true
    })

    cmd({
      interaction,
      client,
      bot: client
    })
  }
})