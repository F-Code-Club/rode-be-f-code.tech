import { Provider } from '@nestjs/common';
import { prefixesForLoggers } from './logger.decorator';
import { LogService } from './logger.service';

function loggerFactory(logger: LogService, prefix: string) {
  if (prefix) {
    logger.setPrefix(prefix);
  }
  return logger;
}

function createLoggerProvider(prefix: string): Provider<LogService> {
  return {
    provide: `LogService${prefix}`,
    //run a the LogService.setPrefix() method before the provider gets created
    useFactory: (logger) => loggerFactory(logger, prefix),
    inject: [LogService],
  };
}

//creates an array of providers for each prefix set by the @Logger() decorator
export function createLoggerProviders(): Array<Provider<LogService>> {
  return prefixesForLoggers.map((prefix) => createLoggerProvider(prefix));
}
