import { Address, BaseEntity, Currency } from '../../core/types/common.types.js';

export enum LifecycleStage {
  SUBSCRIBER = 'SUBSCRIBER',
  LEAD = 'LEAD',
  MARKETING_QUALIFIED_LEAD = 'MQL',
  SALES_QUALIFIED_LEAD = 'SQL',
  OPPORTUNITY = 'OPPORTUNITY',
  CUSTOMER = 'CUSTOMER',
  EVANGELIST = 'EVANGELIST'
}

export enum CompanyTier {
  STARTUP = 'STARTUP',
  MID_MARKET = 'MID_MARKET',
  ENTERPRISE = 'ENTERPRISE',
  FORTUNE_500 = 'FORTUNE_500'
}

export interface ContactEntity extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  title: string;
  department?: string;
  accountId?: string;
  lifecycleStage: LifecycleStage;
  isPrimaryContact: boolean;
  address?: Address;
  linkedInUrl?: string;
  notes?: string[];
  tags?: string[];
  ownerId?: string;
}

export interface AccountEntity extends BaseEntity {
  name: string;
  domain?: string;
  industry: string;
  tier: CompanyTier;
  annualRevenue: number;
  employeeCount: number;
  currency: Currency;
  parentAccountId?: string; // Subsidiary hierarchy
  billingAddress?: Address;
  shippingAddress?: Address;
  ownerId?: string;
  healthScore: number; // 0 to 100 customer health metric
  totalARR: number; // Annual Recurring Revenue calculated from active deals
  activeDealsCount: number;
}

export interface CreateContactDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  department?: string;
  accountId?: string;
  lifecycleStage?: LifecycleStage;
  isPrimaryContact?: boolean;
  tenantId?: string;
  ownerId?: string;
}

export interface CreateAccountDTO {
  name: string;
  domain?: string;
  industry: string;
  tier?: CompanyTier;
  annualRevenue?: number;
  employeeCount?: number;
  currency?: Currency;
  parentAccountId?: string;
  ownerId?: string;
  tenantId?: string;
}
