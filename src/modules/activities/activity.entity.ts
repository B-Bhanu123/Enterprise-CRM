import { BaseEntity, ISOString } from '../../core/types/common.types.js';

export enum ActivityType {
  CALL = 'CALL',
  MEETING = 'MEETING',
  EMAIL = 'EMAIL',
  NOTE = 'NOTE',
  TASK = 'TASK'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export interface ActivityEntity extends BaseEntity {
  type: ActivityType;
  subject: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: ISOString;
  completedAt?: ISOString;
  assignedTo: string; // User ID
  relatedEntityType?: 'lead' | 'contact' | 'account' | 'deal' | 'ticket';
  relatedEntityId?: string;
  durationMinutes?: number;
  location?: string;
  notes?: string[];
}

export interface CreateTaskDTO {
  type?: ActivityType;
  subject: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: ISOString;
  assignedTo: string;
  relatedEntityType?: 'lead' | 'contact' | 'account' | 'deal' | 'ticket';
  relatedEntityId?: string;
  tenantId?: string;
}
