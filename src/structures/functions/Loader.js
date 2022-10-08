const fs = require('fs');

/**
 * 
 * @param {string} path 
 */
module.exports = (path) => {
    const files = fs.readdirSync(path);
    return files;
}