import { MemoryDatabase } from '../../core/database/memory.db.js';
import { CryptoUtils } from '../../core/utils/crypto.utils.ts';
import { ValidatorUtils } from '../../core/utils/validator.utils.ts';
import { NotFoundError, ValidationError } from '../../core/errors/app.error.js';
import { PaginatedResult, QueryOptions } from '../../core/types/common.types.js';
import { EventBus, SystemEvent } from '../../core/events/event.bus.js';
import { LoggerService } from '../../core/logger/logger.service.js';
import { CreateWorkflowDTO, WorkflowEntity, WorkflowExecutionLog, WorkflowTriggerEvent } from './workflow.entity.js';
import { RuleEvaluatorEngine } from './rule.evaluator.js';
import { ActionExecutorService } from './action.executor.js';

export class WorkflowService {
  private static instance: WorkflowService;
  private db = MemoryDatabase.getInstance();
  private eventBus = EventBus.getInstance();
  private logger = LoggerService.getInstance();
  private readonly TABLE_NAME = 'workflows';

  private constructor() {
    this.registerEventListener();
    this.seedDefaultWorkflows();
  }

  public static getInstance(): WorkflowService {
    if (!WorkflowService.instance) {
      WorkflowService.instance = new WorkflowService();
    }
    return WorkflowService.instance;
  }

  private registerEventListener(): void {
    this.eventBus.subscribe('*', async (event: SystemEvent) => {
      await this.processEvent(event);
    });
  }

  private seedDefaultWorkflows(): void {
    const existing = this.db.query<WorkflowEntity>(this.TABLE_NAME, { limit: 1 });
    if (existing.total === 0) {
      this.createWorkflow({
        name: 'Auto Task for High Score Leads',
        description: 'Automatically creates a urgent follow-up task when a high-value lead is created',
        triggerEvent: WorkflowTriggerEvent.LEAD_CREATED,
        conditions: [{ field: 'score', operator: 'gte', value: 70 }],
        actions: [
          {
            type: 'CREATE_TASK' as any,
            config: { subject: '🔥 URGENT: High Score Lead Created! Call Immediately', priority: 'URGENT' }
          }
        ],
        isActive: true
      });
    }
  }

  public createWorkflow(dto: CreateWorkflowDTO): WorkflowEntity {
    if (!ValidatorUtils.isNonEmptyString(dto.name)) {
      throw new ValidationError('Workflow name cannot be empty');
    }

    const workflowId = CryptoUtils.generateUUID();
    const now = new Date().toISOString();

    const workflow: WorkflowEntity = {
      id: workflowId,
      name: ValidatorUtils.sanitizeString(dto.name),
      description: dto.description ? ValidatorUtils.sanitizeString(dto.description) : undefined,
      triggerEvent: dto.triggerEvent,
      isActive: dto.isActive ?? true,
      conditions: dto.conditions || [],
      actions: dto.actions,
      executionHistory: [],
      tenantId: dto.tenantId || 'tenant_default',
      createdAt: now,
      updatedAt: now
    };

    const saved = this.db.insert<WorkflowEntity>(this.TABLE_NAME, workflow);
    this.logger.info('WorkflowService', `Created workflow rule '${saved.name}' for event '${saved.triggerEvent}'`);
    return saved;
  }

  private async processEvent(event: SystemEvent): Promise<void> {
    const matchingWorkflows = this.db.query<WorkflowEntity>(this.TABLE_NAME, {
      filters: [
        { field: 'triggerEvent', operator: 'eq', value: event.eventName },
        { field: 'isActive', operator: 'eq', value: true }
      ]
    });

    for (const workflow of matchingWorkflows.data) {
      const isMatch = RuleEvaluatorEngine.evaluateConditions(event.payload, workflow.conditions);
      const executionId = CryptoUtils.generateUUID();

      if (!isMatch) {
        this.logExecution(workflow.id, {
          executionId,
          timestamp: new Date().toISOString(),
          triggeredByEvent: event.eventName,
          entityId: event.payload?.id || 'N/A',
          actionsExecutedCount: 0,
          status: 'SKIPPED'
        });
        continue;
      }

      this.logger.info('WorkflowService', `Executing workflow '${workflow.name}' for event '${event.eventName}'`);
      let executedCount = 0;

      for (const action of workflow.actions) {
        const success = await ActionExecutorService.executeAction(action, event);
        if (success) executedCount++;
      }

      this.logExecution(workflow.id, {
        executionId,
        timestamp: new Date().toISOString(),
        triggeredByEvent: event.eventName,
        entityId: event.payload?.id || 'N/A',
        actionsExecutedCount: executedCount,
        status: 'SUCCESS'
      });
    }
  }

  private logExecution(workflowId: string, log: WorkflowExecutionLog): void {
    const workflow = this.db.findById<WorkflowEntity>(this.TABLE_NAME, workflowId);
    if (!workflow) return;

    const history = [...workflow.executionHistory, log].slice(-50); // Keep last 50 logs
    this.db.update<WorkflowEntity>(this.TABLE_NAME, workflowId, { executionHistory: history });
  }

  public getWorkflowById(id: string): WorkflowEntity {
    const workflow = this.db.findById<WorkflowEntity>(this.TABLE_NAME, id);
    if (!workflow) {
      throw new NotFoundError('Workflow', id);
    }
    return workflow;
  }

  public queryWorkflows(options: QueryOptions = {}): PaginatedResult<WorkflowEntity> {
    return this.db.query<WorkflowEntity>(this.TABLE_NAME, options);
  }
}
