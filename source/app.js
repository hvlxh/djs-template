require('dotenv/config')
require('./structures/library/Logger')()

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
