import { FormatFn } from 'morgan';

export type MorganConsoleLogFormat = FormatFn<import('http').IncomingMessage, import('http').ServerResponse>;
