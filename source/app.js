preStart()

require('dotenv/config')
require('./structures/library/Logger')()

async function preStart() {
  const { stat } = require('fs/promises')

  try {
    await stat('.env')
  } catch (e) {
    throw new Error('Not having access to .env')
  }

  try {
    await stat('main/config.js')
  } catch (e) {
    throw new Error('Not having access to config.js')
  }
}

async function main() {
  await preStart()
  const Client = require('./structures/library/Client')
  const config = require('../main/config')
  const hvlxh = new Client(config)

  module.exports = hvlxh

  if (hvlxh.getConfig().crashOnErrors) {
    for (const type of [
      'unhandledRejection',
      'uncaughtException',
      'uncaughtExceptionMonitor',
    ]) {
      process.on(type, (err) => console.error(err))
    }
  }

  hvlxh.start()
}

main()
