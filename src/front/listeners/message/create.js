import ListenerRun from "../../../back/base/ListenerRun.js";
import bot from "../../../app.js";

export default ListenerRun('messageCreate', (message) => {
  if (message.author.bot || !message.guild || message.webhookID) return;
  if(!message.content.startsWith(bot.getConfig().defaultPrefix)) {
    return;
  }

  const full = message.content
    .slice(bot.getConfig().defaultPrefix.length)

  let happened;
  let command;
  let args;
  bot.getPrefixCommands().forEach((_, key) => {
    if(full.startsWith(key)) {
      happened = true;
      command = bot.getPrefixCommands().get(key)
      args = full.slice(key.length).trim().split(command.info.arguments[2] || / +/g);
    }
  })

  if(args[0] === '') args.shift()

  if(!happened) return message.reply("Command Not Found.")

  if(args.length < command.info.arguments[1].min) {
    return message.reply(`Minimum Arguments is ${command.info.arguments[1].min} but received ${args.length}`)
  }

  if (command.info.arguments[1].max !== -1 && args.length > command.info.arguments[1].max) {
    return message.reply(
      `Maxmium Arguments is ${command.info.arguments[1].max} but received ${args.length}`,
    );
  }

  command.default({
    client: bot,
    bot,
    message,
    msg: message,
    arguments: args,
    args,
    options: args,
  })
})