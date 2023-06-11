const { GatewayIntentBits: Intents } = require('discord.js')

/** @type {import('../source/types/Configuration').Configuration} */
const config = {
  intents: [
    Intents.Guilds,
    Intents.GuildMembers,
    Intents.GuildMessages,
    Intents.GuildMessageReactions,
    Intents.GuildEmojisAndStickers,
    Intents.GuildIntegrations,
    Intents.GuildInvites,
    Intents.GuildPresences,
    Intents.MessageContent,
  ],
  defaultPrefixes: ['?'],
  developerGuild: '',

  crashOnErrors: false,
}

module.exports = config
