const { Client, Partials, Collection, ApplicationCommandType } = require("discord.js");
const Loader = require("../functions/Loader");
const Logger = require('./Logger');
const { table } = require('table');
const chalk = require('chalk');
const fs = require('fs');

module.exports = class extends Client {
    constructor() {
        super({
            intents: [
                'DirectMessageReactions',
                'DirectMessageTyping',
                'DirectMessages',
                'GuildBans',
                'GuildEmojisAndStickers',
                'GuildIntegrations',
                'GuildInvites',
                'GuildMembers',
                'GuildMessageReactions',
                'GuildMessageTyping',
                'GuildMessages',
                'GuildPresences',
                'GuildScheduledEvents',
                'GuildVoiceStates',
                'GuildWebhooks',
                'Guilds',
                'MessageContent'
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User
            ],
        });

        this.commands = {
            collection: new Collection(),
            array: [],
        };
        this.contexts = {
            collection: new Collection(),
            array: [],
        };
        this.buttons = new Collection();
        this.modals = new Collection();
        this.logger = new Logger();
        this.config = require('../../config');

        (async () => {
            await this.loadEvents('./src/events');
            await this.loadSlashCommands('./src/commands/slash');
            await this.loadContextCommands('./src/commands/context');
            await this.loadButtonCommands('./src/commands/button');
            await this.loadModalCommands('./src/commands/modal');
        })();
    };

    /**
     * 
     * @param {string} path 
     */
    async loadEvents(path) {
        const folders = Loader(path);
        const tableDatas = [
            ['Name', 'Status'],
            ['', ''],
        ];
        const tableConfig = {
            border: {
                topBody: chalk.gray('─'),
                topJoin: chalk.gray('┬'),
                topLeft: chalk.gray('┌'),
                topRight: chalk.gray('┐'),

                bottomBody: chalk.gray('─'),
                bottomJoin: chalk.gray('┴'),
                bottomLeft: chalk.gray('└'),
                bottomRight: chalk.gray('┘'),

                bodyLeft: chalk.gray('│'),
                bodyRight: chalk.gray('│'),
                bodyJoin: chalk.gray('│'),

                joinBody: chalk.gray('─'),
                joinLeft: chalk.gray('├'),
                joinRight: chalk.gray('┤'),
                joinJoin: chalk.gray('┼'),
            },
            header: {
                alignment: 'center',
                content: chalk.bold('Events'),
            },
        };
        const errors = [];

        for (let folder of folders) {
            const files = Loader(`./src/events/${folder}`);
            for (let file of files) {
                const event = require(`../../events/${folder}/${file}`);
                const L = `${process.cwd().replace(/\\/g, '/')}src/events/${folder}/${file}`;

                if (!event.name) {
                    if (files.at(-1) === file) {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}`;
                        tableDatas[1][1] += chalk.red(`Failed`);
                        errors.push('Missing Name')
                    } else {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}\n`;
                        tableDatas[1][1] += chalk.red(`Failed\n`);
                        errors.push('Missing Name');
                    }
                    continue;
                };

                if (!event.run) {
                    if (files.at(-1) === file) {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}`;
                        tableDatas[1][1] += chalk.red(`Failed`);
                        errors.push('Missing Run');
                    } else {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}\n`;
                        tableDatas[1][1] += chalk.red(`Failed\n`);
                        errors.push('Missing Run');
                    }
                    continue;
                }

                if (event.once)
                    this.once(event.name, (...args) => event.run(...args, this));
                else
                    this.on(event.name, (...args) => event.run(...args, this));

                if (files.at(-1) === file) {
                    tableDatas[1][0] += event.name;
                    tableDatas[1][1] += chalk.green(`Success`);
                } else {
                    tableDatas[1][0] += event.name + '\n';
                    tableDatas[1][1] += chalk.green(`Success\n`);
                }
            };
        };

        if (errors.length) {
            tableDatas[0] = ['Name', 'Status', 'Error'];
            tableDatas[1][2] = `${errors.join('\n')}`;
        } else {
            tableDatas[0] = ['Name', 'Status'];
        };


        console.log(table(tableDatas, tableConfig));
    };

    async loadSlashCommands(path) {
        const folders = Loader(path);
        const tableDatas = [
            ['Name', 'Status'],
            ['', ''],
        ];
        const tableConfig = {
            border: {
                topBody: chalk.gray('─'),
                topJoin: chalk.gray('┬'),
                topLeft: chalk.gray('┌'),
                topRight: chalk.gray('┐'),

                bottomBody: chalk.gray('─'),
                bottomJoin: chalk.gray('┴'),
                bottomLeft: chalk.gray('└'),
                bottomRight: chalk.gray('┘'),

                bodyLeft: chalk.gray('│'),
                bodyRight: chalk.gray('│'),
                bodyJoin: chalk.gray('│'),

                joinBody: chalk.gray('─'),
                joinLeft: chalk.gray('├'),
                joinRight: chalk.gray('┤'),
                joinJoin: chalk.gray('┼'),
            },
            header: {
                alignment: 'center',
                content: chalk.bold('Slash Commands'),
            },
        };
        const errors = [];

        let commands = [];
        for (let folder of folders) {
            commands.push({
                name: folder.toLowerCase(),
                description: 'No description provided.',
                options: [],
            });
            const files = Loader(`./src/commands/slash/${folder}`);
            for (let file of files) {
                const a = fs.lstatSync(`./src/commands/slash/${folder}/${file}`);
                if (a.isDirectory()) {
                    const requiredFiles = fs.readdirSync(`./src/commands/slash/${folder}/${file}`);
                    const cmd = commands.find(v => v.name === folder.toLowerCase());
                    cmd.options.push({
                        name: file.toLowerCase(),
                        description: 'No Description Provided',
                        type: 2,
                        options: [],
                    });
                    for (let fis of requiredFiles) {
                        const c = cmd.options.find(v => v.name === file.toLowerCase());
                        const ca = require(`../../commands/slash/${folder}/${file}/${fis}`);
                        ca.type = 1;

                        if (!ca.name || !ca.description || !ca.run) {
                            if (files.at(-1) === file && folders.at(-1) === folder) {
                                tableDatas[1][0] += `${folder}/${file}/${fis}`;
                                tableDatas[1][1] += chalk.redBright(`Failed`);
                                errors.push('Missing Name/Description/Run');
                            } else {
                                tableDatas[1][0] += `${folder}/${file}/${fis}\n`;
                                tableDatas[1][1] += chalk.redBright(`Failed\n`);
                                errors.push('Missing Name/Description/Run');
                            }
                            continue;
                        };

                        c.options.push(ca);
                        this.commands.collection.set(`${folder.toLowerCase()}/${file.toLowerCase()}/${ca.name.toLowerCase()}`, ca);
                        if (files.at(-1) === file && folders.at(-1) === folder && requiredFiles.at(-1)) {
                            tableDatas[1][0] += `${folder}/${file}/${fis}`;
                            tableDatas[1][1] += chalk.greenBright(`Success`);
                        } else {
                            tableDatas[1][0] += `${folder}/${file}/${fis}\n`;
                            tableDatas[1][1] += chalk.greenBright(`Success\n`);
                        }
                    };
                } else {
                    const requiredCmd = require(`../../commands/slash/${folder}/${file}`)
                    const cmd = commands.find(v => v.name === folder.toLowerCase());
                    requiredCmd.type = 1;

                    if (!requiredCmd.name || !requiredCmd.description || !requiredCmd.run) {
                        if (files.at(-1) === file && folders.at(-1) === folder) {
                            tableDatas[1][0] += `${folder}/${file}`;
                            tableDatas[1][1] += chalk.redBright(`Failed\n`);
                            errors.push('Missing Name/Description/Run');
                        } else {
                            tableDatas[1][0] += `${folder}/${file}\n`;
                            tableDatas[1][1] += chalk.redBright(`Failed\n`);
                            errors.push('Missing Name/Description/Run');
                        }
                        continue;
                    }

                    cmd.options.push(requiredCmd);
                    this.commands.collection.set(`${folder.toLowerCase()}/${requiredCmd.name.toLowerCase()}`, requiredCmd);
                    if (files.at(-1) === file && folders.at(-1) === folder) {
                        tableDatas[1][0] += `${folder}/${file}`;
                        tableDatas[1][1] += chalk.greenBright(`Success`);
                    } else {
                        tableDatas[1][0] += `${folder}/${file}\n`;
                        tableDatas[1][1] += chalk.greenBright(`Success\n`);
                    }
                };
            };
        };
        if (errors.length) {
            tableDatas[0] = ['Name', 'Status', 'Error'];
            tableDatas[1][2] = `${errors.join('\n')}`;
        } else {
            tableDatas[0] = ['Name', 'Status'];
        };

        this.commands.array = commands;
        console.log(table(tableDatas, tableConfig))
    };

    /**
     * 
     * @param {string} path 
     */
    async loadContextCommands(path) {
        const folders = Loader(path);
        const tableDatas = [
            ['Name', 'Status'],
            ['', ''],
        ];
        const tableConfig = {
            border: {
                topBody: chalk.gray('─'),
                topJoin: chalk.gray('┬'),
                topLeft: chalk.gray('┌'),
                topRight: chalk.gray('┐'),

                bottomBody: chalk.gray('─'),
                bottomJoin: chalk.gray('┴'),
                bottomLeft: chalk.gray('└'),
                bottomRight: chalk.gray('┘'),

                bodyLeft: chalk.gray('│'),
                bodyRight: chalk.gray('│'),
                bodyJoin: chalk.gray('│'),

                joinBody: chalk.gray('─'),
                joinLeft: chalk.gray('├'),
                joinRight: chalk.gray('┤'),
                joinJoin: chalk.gray('┼'),
            },
            header: {
                alignment: 'center',
                content: chalk.bold('Events'),
            },
        };
        const errors = [];

        for (let folder of folders) {
            const files = Loader(`./src/commands/context/${folder}`);
            for (let file of files) {
                const ctx = require(`../../commands/context/${folder}/${file}`);
                const L = `${process.cwd().replace(/\\/g, '/')}/src/commands/context/${folder}/${file}`;

                if (!ctx.name) {
                    if (files.at(-1) === file) {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}`;
                        tableDatas[1][1] += chalk.red(`Failed`);
                        errors.push('Missing Name')
                    } else {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}\n`;
                        tableDatas[1][1] += chalk.red(`Failed\n`);
                        errors.push('Missing Name');
                    }
                    continue;
                };

                if (!ctx.run) {
                    if (files.at(-1) === file) {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}`;
                        tableDatas[1][1] += chalk.red(`Failed`);
                        errors.push('Missing Run');
                    } else {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}\n`;
                        tableDatas[1][1] += chalk.red(`Failed\n`);
                        errors.push('Missing Run');
                    }
                    continue;
                }

                const types = {
                    'msg': ApplicationCommandType.Message,
                    'message': ApplicationCommandType.Message,
                    'user': ApplicationCommandType.User,
                    'member': ApplicationCommandType.User,
                }

                ctx.type ? ctx.type = types[ctx.type.toLowerCase() || 'message'] : ctx.type = ApplicationCommandType.Message;
                this.contexts.array.push(ctx);
                this.contexts.collection.set(ctx.name, ctx);
                if (files.at(-1) === file) {
                    tableDatas[1][0] += ctx.name;
                    tableDatas[1][1] += chalk.green(`Success`);
                } else {
                    tableDatas[1][0] += ctx.name + '\n';
                    tableDatas[1][1] += chalk.green(`Success\n`);
                }
            };
        };

        if (errors.length) {
            tableDatas[0] = ['Name', 'Status', 'Error'];
            tableDatas[1][2] = `${errors.join('\n')}`;
        } else {
            tableDatas[0] = ['Name', 'Status'];
        };


        console.log(table(tableDatas, tableConfig));
    }

    /**
     * 
     * @param {string} path 
     */
    async loadButtonCommands(path) {
        const folders = Loader(path);
        const tableDatas = [
            ['Name', 'Status'],
            ['', ''],
        ];
        const tableConfig = {
            border: {
                topBody: chalk.gray('─'),
                topJoin: chalk.gray('┬'),
                topLeft: chalk.gray('┌'),
                topRight: chalk.gray('┐'),

                bottomBody: chalk.gray('─'),
                bottomJoin: chalk.gray('┴'),
                bottomLeft: chalk.gray('└'),
                bottomRight: chalk.gray('┘'),

                bodyLeft: chalk.gray('│'),
                bodyRight: chalk.gray('│'),
                bodyJoin: chalk.gray('│'),

                joinBody: chalk.gray('─'),
                joinLeft: chalk.gray('├'),
                joinRight: chalk.gray('┤'),
                joinJoin: chalk.gray('┼'),
            },
            header: {
                alignment: 'center',
                content: chalk.bold('Button Commands'),
            },
        };
        const errors = [];

        for (let folder of folders) {
            const files = Loader(`./src/commands/button/${folder}`);
            for (let file of files) {
                const btn = require(`../../commands/button/${folder}/${file}`);
                const L = `${process.cwd().replace(/\\/g, '/')}/src/commands/button/${folder}/${file}`;

                if (!btn.id) {
                    if (files.at(-1) === file) {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}`;
                        tableDatas[1][1] += chalk.red(`Failed`);
                        errors.push('Missing Name')
                    } else {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}\n`;
                        tableDatas[1][1] += chalk.red(`Failed\n`);
                        errors.push('Missing Name');
                    }
                    continue;
                };

                if (!btn.response) {
                    if (files.at(-1) === file) {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}`;
                        tableDatas[1][1] += chalk.red(`Failed`);
                        errors.push('Missing Run');
                    } else {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}\n`;
                        tableDatas[1][1] += chalk.red(`Failed\n`);
                        errors.push('Missing Run');
                    }
                    continue;
                }

                this.buttons.set(btn.id, btn);
                if (files.at(-1) === file) {
                    tableDatas[1][0] += btn.name;
                    tableDatas[1][1] += chalk.green(`Success`);
                } else {
                    tableDatas[1][0] += btn.name + '\n';
                    tableDatas[1][1] += chalk.green(`Success\n`);
                }
            };
        };

        if (errors.length) {
            tableDatas[0] = ['Name', 'Status', 'Error'];
            tableDatas[1][2] = `${errors.join('\n')}`;
        } else {
            tableDatas[0] = ['Name', 'Status'];
        };


        console.log(table(tableDatas, tableConfig));
    }

    /**
     * 
     * @param {string} path 
     */
    async loadModalCommands(path) {
        const folders = Loader(path);
        const tableDatas = [
            ['Name', 'Status'],
            ['', ''],
        ];
        const tableConfig = {
            border: {
                topBody: chalk.gray('─'),
                topJoin: chalk.gray('┬'),
                topLeft: chalk.gray('┌'),
                topRight: chalk.gray('┐'),

                bottomBody: chalk.gray('─'),
                bottomJoin: chalk.gray('┴'),
                bottomLeft: chalk.gray('└'),
                bottomRight: chalk.gray('┘'),

                bodyLeft: chalk.gray('│'),
                bodyRight: chalk.gray('│'),
                bodyJoin: chalk.gray('│'),

                joinBody: chalk.gray('─'),
                joinLeft: chalk.gray('├'),
                joinRight: chalk.gray('┤'),
                joinJoin: chalk.gray('┼'),
            },
            header: {
                alignment: 'center',
                content: chalk.bold('Modal Commands'),
            },
        };
        const errors = [];

        for (let folder of folders) {
            const files = Loader(`./src/commands/modal/${folder}`);
            for (let file of files) {
                const btn = require(`../../commands/modal/${folder}/${file}`);
                const L = `${process.cwd().replace(/\\/g, '/')}/src/commands/modal/${folder}/${file}`;

                if (!btn.id) {
                    if (files.at(-1) === file) {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}`;
                        tableDatas[1][1] += chalk.red(`Failed`);
                        errors.push('Missing Name')
                    } else {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}\n`;
                        tableDatas[1][1] += chalk.red(`Failed\n`);
                        errors.push('Missing Name');
                    }
                    continue;
                };

                if (!btn.response) {
                    if (files.at(-1) === file) {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}`;
                        tableDatas[1][1] += chalk.red(`Failed`);
                        errors.push('Missing Run');
                    } else {
                        tableDatas[1][0] += `${L[L.length - 2]}/${L[L.length - 1]}\n`;
                        tableDatas[1][1] += chalk.red(`Failed\n`);
                        errors.push('Missing Run');
                    }
                    continue;
                }

                this.buttons.set(btn.id, btn);
                if (files.at(-1) === file) {
                    tableDatas[1][0] += btn.name;
                    tableDatas[1][1] += chalk.green(`Success`);
                } else {
                    tableDatas[1][0] += btn.name + '\n';
                    tableDatas[1][1] += chalk.green(`Success\n`);
                }
            };
        };

        if (errors.length) {
            tableDatas[0] = ['Name', 'Status', 'Error'];
            tableDatas[1][2] = `${errors.join('\n')}`;
        } else {
            tableDatas[0] = ['Name', 'Status'];
        };


        console.log(table(tableDatas, tableConfig));
    }
};