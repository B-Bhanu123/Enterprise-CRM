import { Address, BaseEntity, Currency } from '../../core/types/common.types.js';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  ATTEMPTED_CONTACT = 'ATTEMPTED_CONTACT',
  CONVERTED = 'CONVERTED'
}

export enum LeadSource {
  WEBSITE = 'WEBSITE',
  ORGANIC_SEARCH = 'ORGANIC_SEARCH',
  PAID_CAMPAIGN = 'PAID_CAMPAIGN',
  REFERRAL = 'REFERRAL',
  COLD_CALL = 'COLD_CALL',
  TRADE_SHOW = 'TRADE_SHOW',
  INBOUND_EMAIL = 'INBOUND_EMAIL',
  PARTNER = 'PARTNER'
}

export enum LeadRating {
  COLD = 'COLD',
  WARM = 'WARM',
  HOT = 'HOT'
}

export interface LeadFirmographics {
  companyName: string;
  industry: string;
  employeeCount: number;
  annualRevenue: number;
  currency: Currency;
  website?: string;
}

export interface LeadBehavioralMetrics {
  emailOpensCount: number;
  linkClicksCount: number;
  pageViewsCount: number;
  formSubmissionsCount: number;
  meetingsScheduledCount: number;
  lastEngagedAt?: string;
}

export interface LeadEntity extends BaseEntity {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone?: string;
  address?: Address;
  status: LeadStatus;
  source: LeadSource;
  rating: LeadRating;
  score: number;
  firmographics: LeadFirmographics;
  behavioralMetrics: LeadBehavioralMetrics;
  assignedTo?: string; // User ID
  convertedContactId?: string;
  convertedAccountId?: string;
  convertedDealId?: string;
  notes?: string[];
  tags?: string[];
}

export interface CreateLeadDTO {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone?: string;
  source?: LeadSource;
  companyName: string;
  industry: string;
  employeeCount?: number;
  annualRevenue?: number;
  assignedTo?: string;
  tenantId?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateLeadDTO extends Partial<CreateLeadDTO> {
  status?: LeadStatus;
  rating?: LeadRating;
  score?: number;
}
