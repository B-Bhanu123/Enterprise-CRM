import { MemoryDatabase } from '../../core/database/memory.db.js';
import { CryptoUtils } from '../../core/utils/crypto.utils.ts';
import { ValidatorUtils } from '../../core/utils/validator.utils.ts';
import { NotFoundError, ValidationError } from '../../core/errors/app.error.js';
import { PaginatedResult, QueryOptions } from '../../core/types/common.types.js';
import { EventBus } from '../../core/events/event.bus.js';
import { LoggerService } from '../../core/logger/logger.service.js';
import { CreateTicketDTO, SLA_THRESHOLDS, TicketCategory, TicketEntity, TicketPriority, TicketStatus } from './ticket.entity.js';

export class TicketService {
  private static instance: TicketService;
  private db = MemoryDatabase.getInstance();
  private eventBus = EventBus.getInstance();
  private logger = LoggerService.getInstance();
  private readonly TABLE_NAME = 'tickets';

  private constructor() {}

  public static getInstance(): TicketService {
    if (!TicketService.instance) {
      TicketService.instance = new TicketService();
    }
    return TicketService.instance;
  }

  public createTicket(dto: CreateTicketDTO): TicketEntity {
    if (!ValidatorUtils.isNonEmptyString(dto.subject)) {
      throw new ValidationError('Ticket subject cannot be empty');
    }

    const ticketId = CryptoUtils.generateUUID();
    const ticketNum = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const priority = dto.priority || TicketPriority.MEDIUM;
    const slaConfig = SLA_THRESHOLDS[priority];

    const responseDeadline = new Date(now.getTime() + slaConfig.responseHours * 3600 * 1000).toISOString();
    const resolutionDeadline = new Date(now.getTime() + slaConfig.resolutionHours * 3600 * 1000).toISOString();

    const ticket: TicketEntity = {
      id: ticketId,
      ticketNumber: ticketNum,
      subject: ValidatorUtils.sanitizeString(dto.subject),
      description: ValidatorUtils.sanitizeString(dto.description),
      priority,
      status: TicketStatus.OPEN,
      category: dto.category || TicketCategory.TECHNICAL_ISSUE,
      contactId: dto.contactId,
      accountId: dto.accountId,
      assignedTo: dto.assignedTo,
      responseDeadline,
      resolutionDeadline,
      isResponseSLABreached: false,
      isResolutionSLABreached: false,
      tenantId: dto.tenantId || 'tenant_default',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    const saved = this.db.insert<TicketEntity>(this.TABLE_NAME, ticket);
    this.logger.info('TicketService', `Created ticket '${saved.ticketNumber}' (${saved.subject}) - Priority: ${priority}`);

    this.eventBus.publish('ticket.created', saved, saved.tenantId);
    return saved;
  }

  public respondToTicket(id: string): TicketEntity {
    const ticket = this.getTicketById(id);
    const now = new Date().toISOString();

    const patch: Partial<TicketEntity> = {
      firstRespondedAt: now,
      status: TicketStatus.IN_PROGRESS
    };

    const updated = this.db.update<TicketEntity>(this.TABLE_NAME, id, patch);
    this.eventBus.publish('ticket.responded', updated, updated.tenantId);
    return updated;
  }

  public resolveTicket(id: string, csatRating?: number, feedback?: string): TicketEntity {
    const ticket = this.getTicketById(id);
    const now = new Date().toISOString();

    const patch: Partial<TicketEntity> = {
      status: TicketStatus.RESOLVED,
      resolvedAt: now,
      ...(csatRating && { csatRating }),
      ...(feedback && { csatFeedback: feedback })
    };

    const updated = this.db.update<TicketEntity>(this.TABLE_NAME, id, patch);
    this.logger.info('TicketService', `Resolved ticket '${ticket.ticketNumber}'`);

    this.eventBus.publish('ticket.resolved', updated, updated.tenantId);
    return updated;
  }

  public getTicketById(id: string): TicketEntity {
    const ticket = this.db.findById<TicketEntity>(this.TABLE_NAME, id);
    if (!ticket) {
      throw new NotFoundError('Ticket', id);
    }
    return ticket;
  }

  public queryTickets(options: QueryOptions = {}): PaginatedResult<TicketEntity> {
    return this.db.query<TicketEntity>(this.TABLE_NAME, options);
  }
}
