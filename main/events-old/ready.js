const Event = require('../../source/structures/base/EventOld')

class ReadyEvent extends Event {
  constructor() {
    super({
      name: 'ready',
      once: true,
    })
  }

  run() {
    // console.info('Test')
  }
}

module.exports = ReadyEvent
