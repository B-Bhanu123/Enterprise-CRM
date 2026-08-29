import { BaseEntity, ISOString } from '../../core/types/common.types.js';

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum CampaignType {
  EMAIL_DRIP = 'EMAIL_DRIP',
  NEWSLETTER = 'NEWSLETTER',
  WEBINAR_PROMOTION = 'WEBINAR',
  PRODUCT_UPDATE = 'PRODUCT_UPDATE',
  RE_ENGAGEMENT = 'RE_ENGAGEMENT'
}

export interface SegmentRule {
  field: string;
  operator: 'eq' | 'ne' | 'contains' | 'gt' | 'lt' | 'in';
  value: any;
}

export interface CampaignMetrics {
  targetAudienceCount: number;
  emailsSentCount: number;
  emailsDeliveredCount: number;
  emailsOpenedCount: number;
  linksClickedCount: number;
  unsubscribedCount: number;
  bouncedCount: number;
  openRatePercentage: number;
  clickThroughRatePercentage: number;
}

export interface CampaignEntity extends BaseEntity {
  name: string;
  subject: string;
  type: CampaignType;
  status: CampaignStatus;
  templateContent: string;
  segmentRules: SegmentRule[];
  scheduledAt?: ISOString;
  launchedAt?: ISOString;
  completedAt?: ISOString;
  metrics: CampaignMetrics;
  tags?: string[];
}

export interface CreateCampaignDTO {
  name: string;
  subject: string;
  type?: CampaignType;
  templateContent: string;
  segmentRules?: SegmentRule[];
  scheduledAt?: ISOString;
  tenantId?: string;
}
