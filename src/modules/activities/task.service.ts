import { MemoryDatabase } from '../../core/database/memory.db.js';
import { CryptoUtils } from '../../core/utils/crypto.utils.ts';
import { ValidatorUtils } from '../../core/utils/validator.utils.ts';
import { NotFoundError, ValidationError } from '../../core/errors/app.error.js';
import { PaginatedResult, QueryOptions } from '../../core/types/common.types.js';
import { EventBus } from '../../core/events/event.bus.js';
import { LoggerService } from '../../core/logger/logger.service.js';
import { ActivityEntity, ActivityType, CreateTaskDTO, TaskPriority, TaskStatus } from './activity.entity.js';

export class TaskService {
  private static instance: TaskService;
  private db = MemoryDatabase.getInstance();
  private eventBus = EventBus.getInstance();
  private logger = LoggerService.getInstance();
  private readonly TABLE_NAME = 'activities';

  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  public createTask(dto: CreateTaskDTO): ActivityEntity {
    if (!ValidatorUtils.isNonEmptyString(dto.subject)) {
      throw new ValidationError('Task subject cannot be empty');
    }

    const taskId = CryptoUtils.generateUUID();
    const now = new Date().toISOString();

    const task: ActivityEntity = {
      id: taskId,
      type: dto.type || ActivityType.TASK,
      subject: ValidatorUtils.sanitizeString(dto.subject),
      description: dto.description ? ValidatorUtils.sanitizeString(dto.description) : undefined,
      priority: dto.priority || TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      dueDate: dto.dueDate || new Date(Date.now() + 86400000 * 2).toISOString(), // Default 2 days
      assignedTo: dto.assignedTo,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      tenantId: dto.tenantId || 'tenant_default',
      createdAt: now,
      updatedAt: now
    };

    const saved = this.db.insert<ActivityEntity>(this.TABLE_NAME, task);
    this.logger.info('TaskService', `Created task '${saved.id}' (${saved.subject}) - Assigned to: ${saved.assignedTo}`);

    this.eventBus.publish('task.created', saved, saved.tenantId);
    return saved;
  }

  public completeTask(id: string): ActivityEntity {
    const task = this.getTaskById(id);
    const now = new Date().toISOString();

    const updated = this.db.update<ActivityEntity>(this.TABLE_NAME, id, {
      status: TaskStatus.COMPLETED,
      completedAt: now
    });

    this.logger.info('TaskService', `Task '${id}' marked as COMPLETED`);
    this.eventBus.publish('task.completed', updated, updated.tenantId);
    return updated;
  }

  public getTaskById(id: string): ActivityEntity {
    const task = this.db.findById<ActivityEntity>(this.TABLE_NAME, id);
    if (!task) {
      throw new NotFoundError('Task', id);
    }
    return task;
  }

  public checkOverdueTasks(): ActivityEntity[] {
    const pendingTasks = this.db.query<ActivityEntity>(this.TABLE_NAME, {
      filters: [{ field: 'status', operator: 'eq', value: TaskStatus.PENDING }],
      limit: 5000
    });

    const now = new Date().getTime();
    const overdueTasks: ActivityEntity[] = [];

    for (const task of pendingTasks.data) {
      if (task.dueDate && new Date(task.dueDate).getTime() < now) {
        const updated = this.db.update<ActivityEntity>(this.TABLE_NAME, task.id, {
          status: TaskStatus.OVERDUE
        });
        overdueTasks.push(updated);
        this.eventBus.publish('task.overdue', updated, updated.tenantId);
      }
    }

    if (overdueTasks.length > 0) {
      this.logger.warn('TaskService', `Identified ${overdueTasks.length} overdue tasks`);
    }

    return overdueTasks;
  }

  public queryTasks(options: QueryOptions = {}): PaginatedResult<ActivityEntity> {
    return this.db.query<ActivityEntity>(this.TABLE_NAME, options);
  }
}
