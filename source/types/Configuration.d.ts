import { GatewayIntentBits } from 'discord.js'

export interface Configuration {
  intents: GatewayIntentBits[]
  defaultPrefixes: string[]
  developerGuild: string

  crashOnErrors: boolean
}
