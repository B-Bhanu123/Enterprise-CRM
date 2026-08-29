import { MemoryDatabase } from '../../core/database/memory.db.js';
import { CryptoUtils } from '../../core/utils/crypto.utils.ts';
import { ValidatorUtils } from '../../core/utils/validator.utils.ts';
import { NotFoundError, ValidationError } from '../../core/errors/app.error.js';
import { PaginatedResult, QueryOptions } from '../../core/types/common.types.js';
import { EventBus } from '../../core/events/event.bus.js';
import { LoggerService } from '../../core/logger/logger.service.js';
import { CampaignEntity, CampaignStatus, CampaignType, CreateCampaignDTO } from './campaign.entity.js';
import { ContactEntity } from '../contacts/contact.entity.js';

export class CampaignService {
  private static instance: CampaignService;
  private db = MemoryDatabase.getInstance();
  private eventBus = EventBus.getInstance();
  private logger = LoggerService.getInstance();
  private readonly TABLE_NAME = 'campaigns';

  private constructor() {}

  public static getInstance(): CampaignService {
    if (!CampaignService.instance) {
      CampaignService.instance = new CampaignService();
    }
    return CampaignService.instance;
  }

  public createCampaign(dto: CreateCampaignDTO): CampaignEntity {
    if (!ValidatorUtils.isNonEmptyString(dto.name)) {
      throw new ValidationError('Campaign name cannot be empty');
    }

    const campaignId = CryptoUtils.generateUUID();
    const now = new Date().toISOString();

    const campaign: CampaignEntity = {
      id: campaignId,
      name: ValidatorUtils.sanitizeString(dto.name),
      subject: ValidatorUtils.sanitizeString(dto.subject),
      type: dto.type || CampaignType.NEWSLETTER,
      status: CampaignStatus.DRAFT,
      templateContent: dto.templateContent,
      segmentRules: dto.segmentRules || [],
      scheduledAt: dto.scheduledAt,
      metrics: {
        targetAudienceCount: 0,
        emailsSentCount: 0,
        emailsDeliveredCount: 0,
        emailsOpenedCount: 0,
        linksClickedCount: 0,
        unsubscribedCount: 0,
        bouncedCount: 0,
        openRatePercentage: 0,
        clickThroughRatePercentage: 0
      },
      tenantId: dto.tenantId || 'tenant_default',
      createdAt: now,
      updatedAt: now
    };

    const saved = this.db.insert<CampaignEntity>(this.TABLE_NAME, campaign);
    this.logger.info('CampaignService', `Created campaign '${saved.name}' (ID: ${saved.id})`);

    this.eventBus.publish('campaign.created', saved, saved.tenantId);
    return saved;
  }

  public launchCampaign(id: string): CampaignEntity {
    const campaign = this.getCampaignById(id);

    // Calculate target contacts
    const contacts = this.db.query<ContactEntity>('contacts', {
      tenantId: campaign.tenantId,
      limit: 10000
    });

    const targetAudienceCount = contacts.total || 500;
    const sent = targetAudienceCount;
    const delivered = Math.floor(sent * 0.98);
    const opened = Math.floor(delivered * 0.42);
    const clicked = Math.floor(opened * 0.28);
    const unsub = Math.floor(sent * 0.005);
    const bounced = sent - delivered;

    const openRate = delivered > 0 ? (opened / delivered) * 100 : 0;
    const ctr = opened > 0 ? (clicked / opened) * 100 : 0;

    const now = new Date().toISOString();

    const updated = this.db.update<CampaignEntity>(this.TABLE_NAME, id, {
      status: CampaignStatus.ACTIVE,
      launchedAt: now,
      metrics: {
        targetAudienceCount,
        emailsSentCount: sent,
        emailsDeliveredCount: delivered,
        emailsOpenedCount: opened,
        linksClickedCount: clicked,
        unsubscribedCount: unsub,
        bouncedCount: bounced,
        openRatePercentage: Math.round(openRate * 10) / 10,
        clickThroughRatePercentage: Math.round(ctr * 10) / 10
      }
    });

    this.logger.info('CampaignService', `Campaign '${campaign.name}' launched to ${sent} contacts (Open Rate: ${openRate.toFixed(1)}%)`);
    this.eventBus.publish('campaign.launched', updated, updated.tenantId);
    return updated;
  }

  public getCampaignById(id: string): CampaignEntity {
    const campaign = this.db.findById<CampaignEntity>(this.TABLE_NAME, id);
    if (!campaign) {
      throw new NotFoundError('Campaign', id);
    }
    return campaign;
  }

  public queryCampaigns(options: QueryOptions = {}): PaginatedResult<CampaignEntity> {
    return this.db.query<CampaignEntity>(this.TABLE_NAME, options);
  }
}
