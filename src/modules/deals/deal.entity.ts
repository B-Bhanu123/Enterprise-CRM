import { BaseEntity, Currency, Money } from '../../core/types/common.types.js';

export enum PipelineStage {
  DISCOVERY = 'DISCOVERY',
  QUALIFICATION = 'QUALIFICATION',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST'
}

export const STAGE_PROBABILITIES: Record<PipelineStage, number> = {
  [PipelineStage.DISCOVERY]: 10,
  [PipelineStage.QUALIFICATION]: 30,
  [PipelineStage.PROPOSAL]: 60,
  [PipelineStage.NEGOTIATION]: 85,
  [PipelineStage.CLOSED_WON]: 100,
  [PipelineStage.CLOSED_LOST]: 0
};

export enum DealType {
  NEW_BUSINESS = 'NEW_BUSINESS',
  EXISTING_CUSTOMER_EXPANSION = 'EXISTING_EXPANSION',
  RENEWAL = 'RENEWAL'
}

export enum LostReason {
  PRICE_TOO_HIGH = 'PRICE_TOO_HIGH',
  COMPETITOR_CHOSEN = 'COMPETITOR_CHOSEN',
  FEATURE_GAP = 'FEATURE_GAP',
  NO_BUDGET = 'NO_BUDGET',
  TIMING_INCONVENIENT = 'TIMING_INCONVENIENT',
  GHOSTED = 'GHOSTED'
}

export interface DealEntity extends BaseEntity {
  title: string;
  amount: number;
  currency: Currency;
  stage: PipelineStage;
  probability: number;
  expectedCloseDate: string; // ISO Date
  actualCloseDate?: string;
  type: DealType;
  accountId: string;
  primaryContactId?: string;
  ownerId: string; // Sales Rep User ID
  weightedValue: number; // (amount * probability) / 100
  stageHistory: {
    stage: PipelineStage;
    enteredAt: string;
    exitedAt?: string;
    durationDays?: number;
  }[];
  lostReason?: LostReason;
  lostCompetitorName?: string;
  notes?: string[];
  tags?: string[];
}

export interface CreateDealDTO {
  title: string;
  amount: number;
  currency?: Currency;
  stage?: PipelineStage;
  expectedCloseDate: string;
  type?: DealType;
  accountId: string;
  primaryContactId?: string;
  ownerId: string;
  tenantId?: string;
}
