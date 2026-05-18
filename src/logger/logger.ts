type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  source?: string;
}

interface LogMetadata {
  params?: unknown;
  data?: unknown;
  status?: number;
  message?: string;
  url?: string;
  count?: number;
  total?: number;
  limit?: number;
  from?: number;
  to?: number;
  priorityCount?: number;
  errorMessage?: string;
  id?: string;
  type?: string;
}

class NotificationLogger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private formatMessage(level: LogLevel, message: string, data?: unknown, source?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      source
    };
  }

  private storeLog(entry: LogEntry): void {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  info(message: string, data?: LogMetadata, source?: string): void {
    const entry = this.formatMessage('info', message, data, source);
    this.storeLog(entry);
  }

  warn(message: string, data?: LogMetadata, source?: string): void {
    const entry = this.formatMessage('warn', message, data, source);
    this.storeLog(entry);
  }

  error(message: string, data?: unknown, source?: string): void {
    const entry = this.formatMessage('error', message, data, source);
    this.storeLog(entry);
    console.error(`[ERROR] ${message}`, data);
  }

  debug(message: string, data?: LogMetadata, source?: string): void {
    if (process.env.NODE_ENV === 'development') {
      const entry = this.formatMessage('debug', message, data, source);
      this.storeLog(entry);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    this.info('Logs cleared', undefined, 'Logger');
  }
}

export const logger = new NotificationLogger();