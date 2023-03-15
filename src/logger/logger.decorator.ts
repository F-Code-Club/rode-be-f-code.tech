import { Inject } from '@nestjs/common';

//store all prefixes for loggers
export const prefixesForLoggers: string[] = new Array<string>();

//decorator for injecting logger with prefix
//usage: @Log('prefix') private logger: LogService
export function Log(prefix = '') {
  if (!prefixesForLoggers.includes(prefix)) {
    prefixesForLoggers.push(prefix);
  }
  return Inject(`LogService${prefix}`);
}
