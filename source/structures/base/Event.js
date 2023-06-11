const app = require('../../app')

/**
 * @abstract
 */
class Event {
  /**
   *
   * @param {{
   *   nick?: string
   *   once?: boolean
   * }} options
   */
  constructor(options) {
    this.options = options || {}
    this.client = app
  }

  /**
   * @abstract
   * @param {any[]} args
   */
  // eslint-disable-next-line no-unused-vars
  run(...args) {}
}

module.exports = Event
