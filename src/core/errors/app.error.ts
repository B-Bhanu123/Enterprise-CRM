export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, code: string = 'INTERNAL_ERROR', statusCode: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class NotFoundError extends AppError {
  constructor(entityName: string, id?: string) {
    const msg = id ? `${entityName} with ID '${id}' was not found` : `${entityName} not found`;
    super(msg, 'NOT_FOUND', 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

export class WorkflowExecutionError extends AppError {
  constructor(workflowId: string, reason: string) {
    super(`Workflow execution failed for '${workflowId}': ${reason}`, 'WORKFLOW_EXECUTION_FAILED', 422);
  }
}

export class SLABreachError extends AppError {
  constructor(ticketId: string, hoursOverdue: number) {
    super(`SLA breached for Ticket '${ticketId}' by ${hoursOverdue} hours`, 'SLA_BREACH', 422);
  }
}
