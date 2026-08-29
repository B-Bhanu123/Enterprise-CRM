import { MemoryDatabase } from '../../core/database/memory.db.js';
import { CryptoUtils } from '../../core/utils/crypto.utils.ts';
import { ValidatorUtils } from '../../core/utils/validator.utils.ts';
import { NotFoundError, ValidationError } from '../../core/errors/app.error.js';
import { Currency, PaginatedResult, QueryOptions } from '../../core/types/common.types.js';
import { EventBus } from '../../core/events/event.bus.js';
import { LoggerService } from '../../core/logger/logger.service.js';
import { CreateDealDTO, DealEntity, DealType, LostReason, PipelineStage, STAGE_PROBABILITIES } from './deal.entity.js';
import { ForecastingEngine, ForecastMetrics } from './forecasting.engine.js';
import { AccountService } from '../contacts/account.service.js';

export class DealService {
  private static instance: DealService;
  private db = MemoryDatabase.getInstance();
  private eventBus = EventBus.getInstance();
  private logger = LoggerService.getInstance();
  private accountService = AccountService.getInstance();
  private readonly TABLE_NAME = 'deals';

  private constructor() {}

  public static getInstance(): DealService {
    if (!DealService.instance) {
      DealService.instance = new DealService();
    }
    return DealService.instance;
  }

  public createDeal(dto: CreateDealDTO): DealEntity {
    if (!ValidatorUtils.isPositiveNumber(dto.amount)) {
      throw new ValidationError('Deal amount must be a positive number');
    }

    const dealId = CryptoUtils.generateUUID();
    const now = new Date().toISOString();
    const stage = dto.stage || PipelineStage.DISCOVERY;
    const probability = STAGE_PROBABILITIES[stage];
    const weightedValue = (dto.amount * probability) / 100;

    const deal: DealEntity = {
      id: dealId,
      title: ValidatorUtils.sanitizeString(dto.title),
      amount: dto.amount,
      currency: dto.currency || Currency.USD,
      stage,
      probability,
      expectedCloseDate: dto.expectedCloseDate,
      type: dto.type || DealType.NEW_BUSINESS,
      accountId: dto.accountId,
      primaryContactId: dto.primaryContactId,
      ownerId: dto.ownerId,
      weightedValue,
      stageHistory: [{ stage, enteredAt: now }],
      tenantId: dto.tenantId || 'tenant_default',
      createdAt: now,
      updatedAt: now
    };

    const saved = this.db.insert<DealEntity>(this.TABLE_NAME, deal);
    this.logger.info('DealService', `Created deal '${saved.id}' (${saved.title}) - $${saved.amount} (${stage})`);

    this.recalculateAccountDeals(dto.accountId);
    this.eventBus.publish('deal.created', saved, saved.tenantId);

    return saved;
  }

  public getDealById(id: string): DealEntity {
    const deal = this.db.findById<DealEntity>(this.TABLE_NAME, id);
    if (!deal) {
      throw new NotFoundError('Deal', id);
    }
    return deal;
  }

  public updateStage(id: string, newStage: PipelineStage, lostReason?: LostReason): DealEntity {
    const deal = this.getDealById(id);
    if (deal.stage === newStage) return deal;

    const now = new Date().toISOString();
    const previousStage = deal.stage;

    // Close stage history entry
    const history = [...deal.stageHistory];
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      lastEntry.exitedAt = now;
      const days = Math.max(Math.round((new Date(now).getTime() - new Date(lastEntry.enteredAt).getTime()) / (1000 * 60 * 60 * 24)), 1);
      lastEntry.durationDays = days;
    }
    history.push({ stage: newStage, enteredAt: now });

    const probability = STAGE_PROBABILITIES[newStage];
    const weightedValue = (deal.amount * probability) / 100;

    const patch: Partial<DealEntity> = {
      stage: newStage,
      probability,
      weightedValue,
      stageHistory: history
    };

    if (newStage === PipelineStage.CLOSED_WON || newStage === PipelineStage.CLOSED_LOST) {
      patch.actualCloseDate = now;
    }
    if (newStage === PipelineStage.CLOSED_LOST && lostReason) {
      patch.lostReason = lostReason;
    }

    const updated = this.db.update<DealEntity>(this.TABLE_NAME, id, patch);
    this.logger.info('DealService', `Deal '${id}' stage updated from ${previousStage} to ${newStage}`);

    this.recalculateAccountDeals(deal.accountId);

    if (newStage === PipelineStage.CLOSED_WON) {
      this.eventBus.publish('deal.won', updated, updated.tenantId);
    } else if (newStage === PipelineStage.CLOSED_LOST) {
      this.eventBus.publish('deal.lost', updated, updated.tenantId);
    } else {
      this.eventBus.publish('deal.stage_changed', { deal: updated, previousStage }, updated.tenantId);
    }

    return updated;
  }

  private recalculateAccountDeals(accountId: string): void {
    const accountDeals = this.queryDeals({
      filters: [{ field: 'accountId', operator: 'eq', value: accountId }]
    });

    let totalARR = 0;
    let activeCount = 0;

    for (const deal of accountDeals.data) {
      if (deal.stage === PipelineStage.CLOSED_WON) {
        totalARR += deal.amount;
      } else if (deal.stage !== PipelineStage.CLOSED_LOST) {
        activeCount++;
      }
    }

    try {
      this.accountService.updateAccountMetrics(accountId, totalARR, activeCount);
    } catch {
      // Account might be mock/optional
    }
  }

  public getForecast(tenantId?: string): ForecastMetrics {
    const deals = this.queryDeals({ tenantId, limit: 10000 });
    return ForecastingEngine.calculateForecast(deals.data);
  }

  public queryDeals(options: QueryOptions = {}): PaginatedResult<DealEntity> {
    return this.db.query<DealEntity>(this.TABLE_NAME, options);
  }
}
