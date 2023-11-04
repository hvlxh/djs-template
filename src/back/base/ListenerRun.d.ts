import { ClientEvents } from 'discord.js';

function ListenerRun<Key extends keyof ClientEvents>(
  event: Key,
  run: (...args: ClientEvents[Key]) => any,
): (...args: ClientEvents[Key]) => any;

export default ListenerRun