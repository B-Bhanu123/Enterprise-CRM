import { WorkflowCondition } from './workflow.entity.js';

export class RuleEvaluatorEngine {
  public static evaluateConditions(payload: any, conditions: WorkflowCondition[]): boolean {
    if (!conditions || conditions.length === 0) return true;

    return conditions.every((condition) => {
      const actualValue = this.getNestedValue(payload, condition.field);
      const expectedValue = condition.value;

      switch (condition.operator) {
        case 'eq':
          return actualValue === expectedValue;
        case 'ne':
          return actualValue !== expectedValue;
        case 'gt':
          return actualValue > expectedValue;
        case 'gte':
          return actualValue >= expectedValue;
        case 'lt':
          return actualValue < expectedValue;
        case 'lte':
          return actualValue <= expectedValue;
        case 'contains':
          return typeof actualValue === 'string' && actualValue.toLowerCase().includes(String(expectedValue).toLowerCase());
        case 'in':
          return Array.isArray(expectedValue) && expectedValue.includes(actualValue);
        default:
          return false;
      }
    });
  }

  private static getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  }
}
