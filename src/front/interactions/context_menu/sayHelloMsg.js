/** @param {import('hvlxh').MessageContextRun} param0 */
export default ({ interaction }) => {
  interaction.reply('Hello!');
};

/** @type {import('hvlxh').MessageContext} */
export const info = {
  name: 'Say hello',
  type: 'message',
};
