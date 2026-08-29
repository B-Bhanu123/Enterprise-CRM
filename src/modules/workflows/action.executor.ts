import { TaskService } from '../activities/task.service.js';
import { LoggerService } from '../../core/logger/logger.service.js';
import { WorkflowAction, WorkflowActionType } from './workflow.entity.js';

export class ActionExecutorService {
  private static taskService = TaskService.getInstance();
  private static logger = LoggerService.getInstance();

  public static async executeAction(action: WorkflowAction, eventPayload: any): Promise<boolean> {
    try {
      switch (action.type) {
        case WorkflowActionType.CREATE_TASK: {
          const subject = action.config.subject || `Automated Followup: ${eventPayload.eventName || 'Triggered Event'}`;
          const assignedTo = action.config.assignedTo || eventPayload.payload?.assignedTo || 'user_admin';

          this.taskService.createTask({
            subject,
            description: action.config.description || 'Auto-generated task by Workflow Engine',
            priority: action.config.priority || 'HIGH',
            assignedTo,
            tenantId: eventPayload.tenantId
          });
          break;
        }

        case WorkflowActionType.SEND_NOTIFICATION: {
          this.logger.info('ActionExecutor', `[NOTIFY] Alert sent to user '${action.config.recipientId || 'Admin'}': ${action.config.message}`);
          break;
        }

        case WorkflowActionType.TRIGGER_WEBHOOK: {
          this.logger.info('ActionExecutor', `[WEBHOOK POST] Dispatched payload to ${action.config.webhookUrl}`);
          break;
        }

        case WorkflowActionType.UPDATE_ENTITY_FIELD: {
          this.logger.info('ActionExecutor', `[FIELD UPDATE] Set ${action.config.field} = ${action.config.value}`);
          break;
        }
      }
      return true;
    } catch (err: any) {
      this.logger.error('ActionExecutor', `Action execution failed: ${err.message}`, err);
      return false;
    }
  }
}
