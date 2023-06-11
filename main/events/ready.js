const Event = require('../../source/structures/base/Event')

class ReadyEvent extends Event {
  constructor() {
    super({
      once: true,
    })
  }

  run() {
    const tag = this.client.user?.tag
    console.info('cli', `Logged in as ${tag}`)

    this.client.application?.commands.set(this.client.getCommands().array)
  }
}

module.exports = ReadyEvent
