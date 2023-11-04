import { EmbedBuilder } from 'discord.js'

/** @param {import('hvlxh').PrefixRun} param0 */
export default async ({ message, client, args }) => {
  const msg = await message.reply('Pinging...')
  msg.edit({
    content: "",
    embeds: [
      new EmbedBuilder()
        .setTitle('Pong!')
        .setColor('DarkButNotBlack')
        .setDescription(`> Latency: \`${msg.createdTimestamp - message.createdTimestamp}\`ms\n> API Latency: \`${client.ws.ping}\`ms`),
    ]
  })
}

/** @type {import('hvlxh').Prefix} */
export const info = {
  name: "ping",
  description: "Gives bot latency",
  arguments: [[], { min: 0, max: -1 }, ', '],
}