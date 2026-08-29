import { LeadScoringEngine } from '../src/modules/leads/lead.scoring.engine.js';
import { LeadEntity, LeadRating, LeadSource, LeadStatus } from '../src/modules/leads/lead.entity.js';
import { Currency } from '../src/core/types/common.types.js';

describe('Test Case 1: Lead Scoring Engine Verification', () => {
  it('should calculate HOT rating (score >= 70) for enterprise decision makers with high engagement', () => {
    const enterpriseLead: LeadEntity = {
      id: 'lead_001',
      firstName: 'Sarah',
      lastName: 'Connor',
      title: 'Chief Technology Officer',
      email: 'sconnor@skynet-tech.com',
      phone: '+1-555-0199',
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
      rating: LeadRating.COLD,
      score: 0,
      firmographics: {
        companyName: 'Skynet Tech',
        industry: 'Technology',
        employeeCount: 1500,
        annualRevenue: 85000000,
        currency: Currency.USD
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

    const { score, rating } = LeadScoringEngine.calculateScore(enterpriseLead);

    expect(score).toBeGreaterThanOrEqual(70);
    expect(rating).toBe(LeadRating.HOT);
  });

  it('should calculate COLD rating (score < 40) for small company non-decision makers with low engagement', () => {
    const coldLead: LeadEntity = {
      id: 'lead_002',
      firstName: 'Jim',
      lastName: 'Halpert',
      title: 'Sales Intern',
      email: 'jhalpert@paper-co.com',
      status: LeadStatus.NEW,
      source: LeadSource.COLD_CALL,
      rating: LeadRating.COLD,
      score: 0,
      firmographics: {
        companyName: 'Small Paper Co',
        industry: 'Retail',
        employeeCount: 5,
        annualRevenue: 50000,
        currency: Currency.USD
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

    const { score, rating } = LeadScoringEngine.calculateScore(coldLead);

    expect(score).toBeLessThan(40);
    expect(rating).toBe(LeadRating.COLD);
  });
});
