import { RuleEvaluatorEngine } from '../src/modules/workflows/rule.evaluator.js';
import { WorkflowCondition } from '../src/modules/workflows/workflow.entity.js';

describe('Test Case 4: Event-Driven Workflow Rule Evaluator Verification', () => {
  it('should evaluate complex field conditions correctly (gte, eq, contains)', () => {
    const payload = {
      score: 85,
      status: 'NEW',
      firmographics: {
        industry: 'Technology',
        employeeCount: 500
      }
    };

    const conditions: WorkflowCondition[] = [
      { field: 'score', operator: 'gte', value: 70 },
      { field: 'status', operator: 'eq', value: 'NEW' },
      { field: 'firmographics.industry', operator: 'contains', value: 'tech' }
    ];

    const result = RuleEvaluatorEngine.evaluateConditions(payload, conditions);
    expect(result).toBe(true);
  });

  it('should return false if any condition fails', () => {
    const payload = {
      score: 45,
      status: 'NEW'
    };

    const conditions: WorkflowCondition[] = [
      { field: 'score', operator: 'gte', value: 70 },
      { field: 'status', operator: 'eq', value: 'NEW' }
    ];

    const result = RuleEvaluatorEngine.evaluateConditions(payload, conditions);
    expect(result).toBe(false);
  });
});
