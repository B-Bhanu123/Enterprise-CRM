import { BaseEntity, ISOString } from '../../core/types/common.types.js';

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_CUSTOMER = 'WAITING_CUSTOMER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TicketCategory {
  TECHNICAL_ISSUE = 'TECHNICAL',
  BILLING_INQUIRY = 'BILLING',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  ONBOARDING = 'ONBOARDING',
  BUG_REPORT = 'BUG'
}

// SLA response & resolution deadlines in hours
export const SLA_THRESHOLDS: Record<TicketPriority, { responseHours: number; resolutionHours: number }> = {
  [TicketPriority.LOW]: { responseHours: 24, resolutionHours: 72 },
  [TicketPriority.MEDIUM]: { responseHours: 12, resolutionHours: 48 },
  [TicketPriority.HIGH]: { responseHours: 4, resolutionHours: 16 },
  [TicketPriority.URGENT]: { responseHours: 1, resolutionHours: 4 }
};

export interface TicketEntity extends BaseEntity {
  ticketNumber: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  contactId: string;
  accountId?: string;
  assignedTo?: string; // Support Agent ID
  responseDeadline: ISOString;
  resolutionDeadline: ISOString;
  firstRespondedAt?: ISOString;
  resolvedAt?: ISOString;
  isResponseSLABreached: boolean;
  isResolutionSLABreached: boolean;
  csatRating?: number; // 1 to 5 stars
  csatFeedback?: string;
  tags?: string[];
}

export interface CreateTicketDTO {
  subject: string;
  description: string;
  priority?: TicketPriority;
  category?: TicketCategory;
  contactId: string;
  accountId?: string;
  assignedTo?: string;
  tenantId?: string;
}
