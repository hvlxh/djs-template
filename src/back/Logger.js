/* eslint-disable no-console */

function log(type, date, message, group) {
  const types = {
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR',
    debug: 'DEBUG',
  };

  if (typeof group === 'string')
    console[type](`[${date} // ${types[type]}] [${group}]`, message);
  else console[type](`[${date} // ${types[type]}]`, message);
}

class Logger {
  static info(message, group) {
    const date = new Date();
    const dateStr = date.toLocaleString().toUpperCase().replace(', ', ' ');

    log('info', dateStr, message, group);
  }

  static warn(message, group) {
    const date = new Date();
    const dateStr = date.toLocaleString().toUpperCase().replace(', ', ' ');

    log('warn', dateStr, message, group);
  }

  static error(message, group) {
    const date = new Date();
    const dateStr = date.toLocaleString().toUpperCase().replace(', ', ' ');

    log('error', dateStr, message, group);
  }

  static debug(message, group) {
    const date = new Date();
    const dateStr = date.toLocaleString().toUpperCase().replace(', ', ' ');

    log('debug', dateStr, message, group);
  }
}

export default Logger;
