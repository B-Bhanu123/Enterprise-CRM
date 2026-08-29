"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lead_scoring_engine_js_1 = require("../src/modules/leads/lead.scoring.engine.js");
const lead_entity_js_1 = require("../src/modules/leads/lead.entity.js");
const common_types_js_1 = require("../src/core/types/common.types.js");
describe('Test Case 1: Lead Scoring Engine Verification', () => {
    it('should calculate HOT rating (score >= 70) for enterprise decision makers with high engagement', () => {
        const enterpriseLead = {
            id: 'lead_001',
            firstName: 'Sarah',
            lastName: 'Connor',
            title: 'Chief Technology Officer',
            email: 'sconnor@skynet-tech.com',
            phone: '+1-555-0199',
            status: lead_entity_js_1.LeadStatus.NEW,
            source: lead_entity_js_1.LeadSource.WEBSITE,
            rating: lead_entity_js_1.LeadRating.COLD,
            score: 0,
            firmographics: {
                companyName: 'Skynet Tech',
                industry: 'Technology',
                employeeCount: 1500,
                annualRevenue: 85000000,
                currency: common_types_js_1.Currency.USD
            },
            behavioralMetrics: {
                emailOpensCount: 10,
                linkClicksCount: 5,
                pageViewsCount: 20,
                formSubmissionsCount: 2,
                meetingsScheduledCount: 1,
                lastEngagedAt: new Date().toISOString()
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const { score, rating } = lead_scoring_engine_js_1.LeadScoringEngine.calculateScore(enterpriseLead);
        expect(score).toBeGreaterThanOrEqual(70);
        expect(rating).toBe(lead_entity_js_1.LeadRating.HOT);
    });
    it('should calculate COLD rating (score < 40) for small company non-decision makers with low engagement', () => {
        const coldLead = {
            id: 'lead_002',
            firstName: 'Jim',
            lastName: 'Halpert',
            title: 'Sales Intern',
            email: 'jhalpert@paper-co.com',
            status: lead_entity_js_1.LeadStatus.NEW,
            source: lead_entity_js_1.LeadSource.COLD_CALL,
            rating: lead_entity_js_1.LeadRating.COLD,
            score: 0,
            firmographics: {
                companyName: 'Small Paper Co',
                industry: 'Retail',
                employeeCount: 5,
                annualRevenue: 50000,
                currency: common_types_js_1.Currency.USD
            },
            behavioralMetrics: {
                emailOpensCount: 0,
                linkClicksCount: 0,
                pageViewsCount: 1,
                formSubmissionsCount: 0,
                meetingsScheduledCount: 0
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const { score, rating } = lead_scoring_engine_js_1.LeadScoringEngine.calculateScore(coldLead);
        expect(score).toBeLessThan(40);
        expect(rating).toBe(lead_entity_js_1.LeadRating.COLD);
    });
});
