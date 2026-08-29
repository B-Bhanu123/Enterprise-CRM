"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule_evaluator_js_1 = require("../src/modules/workflows/rule.evaluator.js");
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
        const conditions = [
            { field: 'score', operator: 'gte', value: 70 },
            { field: 'status', operator: 'eq', value: 'NEW' },
            { field: 'firmographics.industry', operator: 'contains', value: 'tech' }
        ];
        const result = rule_evaluator_js_1.RuleEvaluatorEngine.evaluateConditions(payload, conditions);
        expect(result).toBe(true);
    });
    it('should return false if any condition fails', () => {
        const payload = {
            score: 45,
            status: 'NEW'
        };
        const conditions = [
            { field: 'score', operator: 'gte', value: 70 },
            { field: 'status', operator: 'eq', value: 'NEW' }
        ];
        const result = rule_evaluator_js_1.RuleEvaluatorEngine.evaluateConditions(payload, conditions);
        expect(result).toBe(false);
    });
});
