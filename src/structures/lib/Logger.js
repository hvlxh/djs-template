const chalk = require('chalk');

module.exports = class {
    /**
     * 
     * @param {string} text 
     * @param {string[] | undefined} groups 
     */
    log(text, groups) {
        if (groups) {
            const mapped = groups.map(v => `[${v}]`);
            console.log(`${chalk.green(mapped.join(" "))} - ${text}`);
        } else {
            console.log(text);
        };
    }

    /**
     * 
     * @param {string} text 
     * @param {string[] | undefined} groups 
     */
    error(text, groups) {
        if (groups) {
            const mapped = groups.map(v => `[${v}]`);
            console.error(`${groups.join(" ")} - ${text}`);
        } else {
            console.error(text);
        };
    }
};