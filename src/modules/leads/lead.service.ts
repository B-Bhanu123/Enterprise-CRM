import { MemoryDatabase } from '../../core/database/memory.db.js';
import { CryptoUtils } from '../../core/utils/crypto.utils.ts';
import { ValidatorUtils } from '../../core/utils/validator.utils.ts';
import { NotFoundError, ValidationError } from '../../core/errors/app.error.js';
import { Currency, PaginatedResult, QueryOptions } from '../../core/types/common.types.js';
import { EventBus } from '../../core/events/event.bus.js';
import { LoggerService } from '../../core/logger/logger.service.js';
import { CreateLeadDTO, LeadEntity, LeadRating, LeadSource, LeadStatus, UpdateLeadDTO } from './lead.entity.js';
import { LeadScoringEngine } from './lead.scoring.engine.js';
import { LeadAssignmentEngine } from './lead.assignment.engine.js';

export class LeadService {
  private static instance: LeadService;
  private db = MemoryDatabase.getInstance();
  private eventBus = EventBus.getInstance();
  private logger = LoggerService.getInstance();
  private readonly TABLE_NAME = 'leads';

  private constructor() {}

  public static getInstance(): LeadService {
    if (!LeadService.instance) {
      LeadService.instance = new LeadService();
    }
    return LeadService.instance;
  }

  public createLead(dto: CreateLeadDTO, createdByUserId: string): LeadEntity {
    if (!ValidatorUtils.isValidEmail(dto.email)) {
      throw new ValidationError(`Invalid email address: ${dto.email}`);
    }

    const leadId = CryptoUtils.generateUUID();
    const now = new Date().toISOString();

    const initialLead: LeadEntity = {
      id: leadId,
      firstName: ValidatorUtils.sanitizeString(dto.firstName),
      lastName: ValidatorUtils.sanitizeString(dto.lastName),
      title: ValidatorUtils.sanitizeString(dto.title),
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      status: LeadStatus.NEW,
      source: dto.source || LeadSource.WEBSITE,
      rating: LeadRating.COLD,
      score: 0,
      firmographics: {
        companyName: ValidatorUtils.sanitizeString(dto.companyName),
        industry: dto.industry || 'General',
        employeeCount: dto.employeeCount || 10,
        annualRevenue: dto.annualRevenue || 100000,
        currency: Currency.USD
      },
      behavioralMetrics: {
        emailOpensCount: 0,
        linkClicksCount: 0,
        pageViewsCount: 1,
        formSubmissionsCount: 1,
        meetingsScheduledCount: 0,
        lastEngagedAt: now
      },
      tenantId: dto.tenantId || 'tenant_default',
      notes: dto.notes ? [dto.notes] : [],
      tags: dto.tags || [],
      createdAt: now,
      updatedAt: now
    };

    // Calculate score
    const { score, rating } = LeadScoringEngine.calculateScore(initialLead);
    initialLead.score = score;
    initialLead.rating = rating;

    // Auto assignment
    if (!dto.assignedTo) {
      initialLead.assignedTo = LeadAssignmentEngine.assignLead(initialLead);
    } else {
      initialLead.assignedTo = dto.assignedTo;
    }

    const savedLead = this.db.insert<LeadEntity>(this.TABLE_NAME, initialLead);

    this.logger.info('LeadService', `Lead created '${savedLead.id}' with score ${score} (${rating})`);

    // Publish system event for workflow automation
    this.eventBus.publish('lead.created', savedLead, savedLead.tenantId);

    return savedLead;
  }

  public getLeadById(id: string): LeadEntity {
    const lead = this.db.findById<LeadEntity>(this.TABLE_NAME, id);
    if (!lead) {
      throw new NotFoundError('Lead', id);
    }
    return lead;
  }

  public updateLead(id: string, dto: UpdateLeadDTO): LeadEntity {
    const existing = this.getLeadById(id);

    const patch: Partial<LeadEntity> = {
      ...(dto.firstName && { firstName: ValidatorUtils.sanitizeString(dto.firstName) }),
      ...(dto.lastName && { lastName: ValidatorUtils.sanitizeString(dto.lastName) }),
      ...(dto.title && { title: ValidatorUtils.sanitizeString(dto.title) }),
      ...(dto.email && { email: dto.email.toLowerCase() }),
      ...(dto.phone && { phone: dto.phone }),
      ...(dto.status && { status: dto.status }),
      ...(dto.assignedTo && { assignedTo: dto.assignedTo }),
      ...(dto.tags && { tags: dto.tags })
    };

    if (dto.companyName || dto.industry || dto.employeeCount || dto.annualRevenue) {
      patch.firmographics = {
        ...existing.firmographics,
        ...(dto.companyName && { companyName: dto.companyName }),
        ...(dto.industry && { industry: dto.industry }),
        ...(dto.employeeCount && { employeeCount: dto.employeeCount }),
        ...(dto.annualRevenue && { annualRevenue: dto.annualRevenue })
      };
    }

    const updated = this.db.update<LeadEntity>(this.TABLE_NAME, id, patch);

    // Recalculate score
    const { score, rating } = LeadScoringEngine.calculateScore(updated);
    if (score !== updated.score || rating !== updated.rating) {
      this.db.update<LeadEntity>(this.TABLE_NAME, id, { score, rating });
      updated.score = score;
      updated.rating = rating;
    }

    this.eventBus.publish('lead.updated', updated, updated.tenantId);
    return updated;
  }

  public recordEngagement(id: string, type: 'open' | 'click' | 'page_view' | 'meeting'): LeadEntity {
    const lead = this.getLeadById(id);
    const metrics = { ...lead.behavioralMetrics, lastEngagedAt: new Date().toISOString() };

    switch (type) {
      case 'open':
        metrics.emailOpensCount++;
        break;
      case 'click':
        metrics.linkClicksCount++;
        break;
      case 'page_view':
        metrics.pageViewsCount++;
        break;
      case 'meeting':
        metrics.meetingsScheduledCount++;
        break;
    }

    const updated = this.db.update<LeadEntity>(this.TABLE_NAME, id, { behavioralMetrics: metrics });
    const { score, rating } = LeadScoringEngine.calculateScore(updated);
    this.db.update<LeadEntity>(this.TABLE_NAME, id, { score, rating });

    this.eventBus.publish('lead.engaged', { lead: updated, type }, updated.tenantId);
    return this.getLeadById(id);
  }

  public queryLeads(options: QueryOptions = {}): PaginatedResult<LeadEntity> {
    return this.db.query<LeadEntity>(this.TABLE_NAME, options);
  }
}
