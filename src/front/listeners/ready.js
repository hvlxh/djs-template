import Logger from '../../back/Logger.js';
import client from '../../app.js';
import ListenerRun from '../../back/base/ListenerRun.js';

export default ListenerRun('ready', () => {
  Logger.info('The bot is ready to use!', 'Bot');

  client.application.commands.set(client.getSlashCommands().array);
})

/** @type {import('hvlxh').Listener} */
export const info = {
  once: true,
};
