const Client = require('./structures/lib/Client');
const client = new Client();

client.login(client.config.token);