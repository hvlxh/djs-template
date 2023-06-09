// @ts-nocheck
const chalk = require('chalk')

const Logger = () => {
  const methods = ['info', 'warn', 'error', 'debug']
  methods.forEach((method) => {
    const backup = console[method]
    console[method] = (group, ...data) => {
      const date = new Date().toLocaleString().toUpperCase().replace(', ', ' ')
      const type = colorize(method)

      if (data.length !== 0) {
        data.forEach((d) => {
          backup(
            `${`[${date} ${type}]`} [${chalk.whiteBright(chalk.bold(group))}]`,
            d
          )
        })
      } else {
        backup(`[${date} ${type}]`, group)
      }
    }
  })
}

/**
 *
 * @param {"info" | "warn" | "error" | "debug"} type
 */
const colorize = (type) => {
  switch (type) {
    case 'info':
      return chalk.green('INFO')
    case 'warn':
      return chalk.yellow('WARN')
    case 'error':
      return chalk.red('ERRR')
    case 'debug':
      return chalk.white('DBUG')
  }
}

module.exports = Logger
