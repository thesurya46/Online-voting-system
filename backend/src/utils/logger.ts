enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARN = 'WARN',
  DEBUG = 'DEBUG'
}

class Logger {
  private timestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const baseMessage = `[${this.timestamp()}] [${level}] ${message}`;
    return data ? `${baseMessage} | ${JSON.stringify(data)}` : baseMessage;
  }

  info(message: string, data?: unknown): void {
    console.log(this.formatMessage(LogLevel.INFO, message, data));
  }

  error(message: string, error?: unknown): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, error));
  }

  warn(message: string, data?: unknown): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, data));
  }

  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, data));
    }
  }
}

export const logger = new Logger();
