import { DynamicModule, Global } from '@nestjs/common';
import { LogService } from './logger.service';
import { createLoggerProviders } from './logger.providers';

/**
 * LoggerModule: DynamicModule
 * Create the module settings (with @Module decorator) via a method.
 * This method will get called after the @Logger decorator calls.
 * Therefore prefixForLoggers array will contain all the values.
 */
@Global()
export class LogModule {
  static forRoot(): DynamicModule {
    const loggerProviders = createLoggerProviders();
    return {
      module: LogModule,
      providers: [LogService, ...loggerProviders],
      exports: [LogService, ...loggerProviders],
    };
  }
}
