import { ISOString } from '../types/common.types.js';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

export interface LogEntry {
  timestamp: ISOString;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
}

export class LoggerService {
  private static instance: LoggerService;
  private minLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];

  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatEntry(entry: LogEntry): string {
    const metaStr = entry.metadata ? ` | Meta: ${JSON.stringify(entry.metadata)}` : '';
    const stackStr = entry.stackTrace ? `\nStack: ${entry.stackTrace}` : '';
    return `[${entry.timestamp}] [${entry.level}] [${entry.context}]: ${entry.message}${metaStr}${stackStr}`;
  }

  private log(level: LogLevel, context: string, message: string, metadata?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      metadata,
      stackTrace: error?.stack
    };

    this.logs.push(entry);
    const formatted = this.formatEntry(entry);

    switch (level) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        console.log(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formatted);
        break;
    }
  }

  public debug(context: string, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, context, message, metadata);
  }

  public info(context: string, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, context, message, metadata);
  }

  public warn(context: string, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, context, message, metadata);
  }

  public error(context: string, message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, context, message, metadata, error);
  }

  public fatal(context: string, message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log(LogLevel.FATAL, context, message, metadata, error);
  }

  public getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }
}
