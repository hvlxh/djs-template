const fs = require('fs')
const path = require('path')

/**
 *
 * @param {string} directory
 * @returns
 */
function getDirectoryNames(directory) {
  const dirEntries = fs.readdirSync(directory, { withFileTypes: true })
  const dirNames = dirEntries.map((dir) => {
    if (dir.isDirectory()) {
      getDirectoryNames(directory + dir)
    } else {
      const direct = directory.replace('main\\events\\', '')
      /**
       *
       * @param {string} param0
       * @returns
       */
      const capitalize = ([first, ...rest]) =>
        first.toUpperCase() + rest.join('')

      return {
        name: `${direct}${capitalize(dir.name)}`.replace('.js', ''),
        path: path.join(directory, dir.name),
      }
    }
  })

  return dirNames
}

/**
 *
 * @param {string} directory
 * @returns {{ name: string, path: string }[]}
 */
function EventsLoader(directory) {
  const dirEntries = fs.readdirSync(directory, { withFileTypes: true })
  const dirNames = []

  for (const entry of dirEntries) {
    if (entry.isDirectory()) {
      const subdirPath = path.join(directory, entry.name)
      const subdirNames = getDirectoryNames(subdirPath)
      dirNames.push(...subdirNames)
    } else {
      dirNames.push({
        name: entry.name.replace('.js', ''),
        path: path.join(directory, entry.name),
      })
    }
  }

  // @ts-ignore
  return dirNames
}

module.exports = EventsLoader
