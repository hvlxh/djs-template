declare module 'hvlxh' {
  import {
    ChatInputApplicationCommandData,
    ClientOptions,
    CommandInteraction,
    CommandInteractionOptionResolver,
    UserApplicationCommandData,
    MessageApplicationCommandData,
    ContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    Message,
    ClientEvents,
  } from 'discord.js';
  import Bot from './src/back/Bot.js';

  export interface Configuration {
    clientOptions: ClientOptions;
    defaultPrefix?: string;
  }

  export interface Listener {
    once?: boolean;
    nick?: string;
  }

  export interface Command
    extends Omit<ChatInputApplicationCommandData, 'name'> {
  }

  export type CommandRun = {
    client: import('./src/back/Bot.js').default;
    bot: import('./src/Bot.js').default;
    interaction: CommandInteraction;
    options: CommandInteractionOptionResolver;
  };

  export type UserContextRun = {
    client: import('./src/back/Bot.js').default;
    bot: import('./src/Bot.js').default;
    interaction: UserContextMenuCommandInteraction;
  };

  export type MessageContextRun = {
    client: import('./src/back/Bot.js').default;
    bot: import('./src/Bot.js').default;
    interaction: MessageContextMenuCommandInteraction;
  };

  export type UserContext = {
    type: 'user' | 'message';
  } & Omit<UserApplicationCommandData, 'type'>;
  export type MessageContext = {
    type: 'user' | 'message';
  } & Omit<MessageApplicationCommandData, 'type'>;

  export interface Prefix {
    name: string;
    description: string;
    aliases?: string[]
    arguments: [
      { name: string; required: boolean }[],
      { min: number, max: number }
    ]
  }

  export type PrefixRun = {
    client: import('./src/back/Bot.js').default;
    bot: import('./src/Bot.js').default;
    message: Message,
    msg: Message,
    arguments: string[],
    args: string[],
    options: string[]
  };
}
