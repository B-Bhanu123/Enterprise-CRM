/**
 * Enterprise CRM Core Domain Types & DTO Definitions
 */

export type UUID = string;
export type ISOString = string;

export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  INR = 'INR',
  JPY = 'JPY'
}

export interface Money {
  amount: number;
  currency: Currency;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary?: boolean;
}

export interface AuditMeta {
  createdAt: ISOString;
  createdBy: UUID;
  updatedAt: ISOString;
  updatedBy: UUID;
  version: number;
  isDeleted?: boolean;
  deletedAt?: ISOString;
}

export interface PaginationQuery {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  timestamp: ISOString;
}

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'startsWith';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface QueryOptions {
  filters?: FilterCondition[];
  pagination?: PaginationQuery;
  tenantId?: string;
  includeDeleted?: boolean;
}
