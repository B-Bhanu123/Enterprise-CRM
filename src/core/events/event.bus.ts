import { LoggerService } from '../logger/logger.service.js';

export type EventCallback<T = any> = (payload: T) => Promise<void> | void;

export interface SystemEvent<T = any> {
  eventName: string;
  payload: T;
  timestamp: string;
  tenantId?: string;
}

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, EventCallback[]> = new Map();
  private logger = LoggerService.getInstance();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T = any>(eventName: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(callback);

    this.logger.debug('EventBus', `Subscribed to event '${eventName}'`);

    return () => {
      const callbacks = this.listeners.get(eventName);
      if (callbacks) {
        this.listeners.set(
          eventName,
          callbacks.filter((cb) => cb !== callback)
        );
      }
    };
  }

  public async publish<T = any>(eventName: string, payload: T, tenantId?: string): Promise<void> {
    const event: SystemEvent<T> = {
      eventName,
      payload,
      timestamp: new Date().toISOString(),
      tenantId
    };

    this.logger.info('EventBus', `Publishing event '${eventName}'`, { tenantId });

    const callbacks = this.listeners.get(eventName) || [];
    const wildcardCallbacks = this.listeners.get('*') || [];

    const allCallbacks = [...callbacks, ...wildcardCallbacks];

    for (const callback of allCallbacks) {
      try {
        await callback(event);
      } catch (err: any) {
        this.logger.error('EventBus', `Error executing listener for event '${eventName}'`, err);
      }
    }
  }

  public clearAllListeners(): void {
    this.listeners.clear();
  }
}
