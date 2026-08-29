import { MemoryDatabase } from '../../core/database/memory.db.js';
import { EventBus } from '../../core/events/event.bus.js';
import { LoggerService } from '../../core/logger/logger.service.js';
import { TicketEntity, TicketStatus } from './ticket.entity.js';

export class SLAMonitorService {
  private static db = MemoryDatabase.getInstance();
  private static eventBus = EventBus.getInstance();
  private static logger = LoggerService.getInstance();

  public static auditSLAs(): { breachedResponseCount: number; breachedResolutionCount: number } {
    const activeTickets = this.db.query<TicketEntity>('tickets', {
      filters: [
        { field: 'status', operator: 'ne', value: TicketStatus.RESOLVED },
        { field: 'status', operator: 'ne', value: TicketStatus.CLOSED }
      ],
      limit: 10000
    });

    const now = new Date().getTime();
    let breachedResponseCount = 0;
    let breachedResolutionCount = 0;

    for (const ticket of activeTickets.data) {
      let isBreached = false;
      const patch: Partial<TicketEntity> = {};

      // Check response SLA
      if (!ticket.firstRespondedAt && !ticket.isResponseSLABreached) {
        if (new Date(ticket.responseDeadline).getTime() < now) {
          patch.isResponseSLABreached = true;
          breachedResponseCount++;
          isBreached = true;
        }
      }

      // Check resolution SLA
      if (!ticket.isResolutionSLABreached) {
        if (new Date(ticket.resolutionDeadline).getTime() < now) {
          patch.isResolutionSLABreached = true;
          breachedResolutionCount++;
          isBreached = true;
        }
      }

      if (isBreached) {
        const updated = this.db.update<TicketEntity>('tickets', ticket.id, patch);
        this.logger.warn('SLAMonitorService', `SLA Breach detected for Ticket '${ticket.ticketNumber}'`);
        this.eventBus.publish('sla.breached', updated, updated.tenantId);
      }
    }

    return { breachedResponseCount, breachedResolutionCount };
  }
}
