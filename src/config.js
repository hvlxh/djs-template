import { GatewayIntentBits as Intents } from 'discord.js';

/**
 * @type {import('hvlxh').Configuration}
 */
const config = {
  clientOptions: {
    intents: [
      Intents.Guilds,
      Intents.GuildMessages,
      Intents.GuildMembers,
      Intents.GuildPresences,
      Intents.MessageContent,
    ],
  },
  defaultPrefix: "!"
};

export default config;
