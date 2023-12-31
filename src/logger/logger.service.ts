import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({
  //every time the LogService gets injected, a new instance is created with different prefix
  scope: Scope.TRANSIENT,
})
export class LogService extends Logger {
  //prefix for every log message
  private prefix?: string;

  log(message: string) {
    let formattedMessage = message;
    if (this.prefix) {
      formattedMessage = `[${this.prefix}] ${message}`;
    }
    super.log(formattedMessage);
  }

  debug(message: string) {
    let formattedMessage = message;
    if (this.prefix) {
      formattedMessage = `[${this.prefix}] ${message}`;
    }
    super.debug(formattedMessage);
  }

  error(message: string) {
    let formattedMessage = message;
    if (this.prefix) {
      formattedMessage = `[${this.prefix}] ${message}`;
    }
    super.error(formattedMessage);
  }

  warn(message: string) {
    let formattedMessage = message;
    if (this.prefix) {
      formattedMessage = `[${this.prefix}] ${message}`;
    }
    super.warn(formattedMessage);
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }
}
