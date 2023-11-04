import { EmbedBuilder } from 'discord.js'

/** @param {import('hvlxh').CommandRun} param0 */
export default async ({ interaction, client }) => {
  const message = await interaction.reply({
    content: "Pinging...",
    fetchReply: true
  })

  interaction.editReply({
    content: "",
    embeds: [
      new EmbedBuilder()
        .setTitle('Pong!')
        .setColor('DarkButNotBlack')
        .setDescription(`> Latency: \`${message.createdTimestamp - interaction.createdTimestamp}\`ms\n> API Latency: \`${client.ws.ping}\`ms`),
    ]
  })
}

/** @type {import('hvlxh').Command} */
export const info = {
  description: 'Give bot latency'
}