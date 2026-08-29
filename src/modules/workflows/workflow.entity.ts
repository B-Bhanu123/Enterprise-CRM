import { BaseEntity, ISOString } from '../../core/types/common.types.js';

export enum WorkflowTriggerEvent {
  LEAD_CREATED = 'lead.created',
  LEAD_UPDATED = 'lead.updated',
  LEAD_ENGAGED = 'lead.engaged',
  DEAL_CREATED = 'deal.created',
  DEAL_STAGE_CHANGED = 'deal.stage_changed',
  DEAL_WON = 'deal.won',
  DEAL_LOST = 'deal.lost',
  TICKET_CREATED = 'ticket.created',
  SLA_BREACHED = 'sla.breached',
  TASK_OVERDUE = 'task.overdue'
}

export enum WorkflowActionType {
  CREATE_TASK = 'CREATE_TASK',
  SEND_NOTIFICATION = 'SEND_NOTIFICATION',
  UPDATE_ENTITY_FIELD = 'UPDATE_FIELD',
  TRIGGER_WEBHOOK = 'TRIGGER_WEBHOOK',
  ASSIGN_OWNER = 'ASSIGN_OWNER'
}

export interface WorkflowCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface WorkflowAction {
  type: WorkflowActionType;
  config: Record<string, any>;
}

export interface WorkflowExecutionLog {
  executionId: string;
  timestamp: ISOString;
  triggeredByEvent: string;
  entityId: string;
  actionsExecutedCount: number;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  errorMessage?: string;
}

export interface WorkflowEntity extends BaseEntity {
  name: string;
  description?: string;
  triggerEvent: WorkflowTriggerEvent;
  isActive: boolean;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  executionHistory: WorkflowExecutionLog[];
}

export interface CreateWorkflowDTO {
  name: string;
  description?: string;
  triggerEvent: WorkflowTriggerEvent;
  conditions?: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive?: boolean;
  tenantId?: string;
}
