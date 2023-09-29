import 'dotenv/config';
import Bot from './back/Bot.js';

const bot = new Bot();
bot.login(process.env.TOKEN);

export default bot;
