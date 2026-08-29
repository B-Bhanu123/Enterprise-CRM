/**
 * Enterprise Synthetic Data Registry Generator for CRM Testing & Scale Benchmarking
 */

export interface GeneratedLeadRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  title: string;
  industry: string;
  score: number;
  rating: string;
  annualRevenue: number;
  employeeCount: number;
  status: string;
  source: string;
  createdAt: string;
}

export const GENERATED_ENTERPRISE_LEADS: GeneratedLeadRecord[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `gen_lead_${10000 + i}`,
  firstName: `Firstname_${i}`,
  lastName: `Lastname_${i}`,
  email: `lead_${i}@enterprise-client-${i % 50}.com`,
  companyName: `Global Corporation ${i % 100}`,
  title: i % 4 === 0 ? 'Chief Executive Officer' : i % 4 === 1 ? 'VP of Technology' : i % 4 === 2 ? 'Director of IT' : 'Manager',
  industry: i % 5 === 0 ? 'Technology' : i % 5 === 1 ? 'Finance' : i % 5 === 2 ? 'Healthcare' : i % 5 === 3 ? 'Manufacturing' : 'Retail',
  score: 30 + (i % 65),
  rating: i % 3 === 0 ? 'HOT' : i % 3 === 1 ? 'WARM' : 'COLD',
  annualRevenue: 500000 + i * 25000,
  employeeCount: 20 + i * 5,
  status: i % 4 === 0 ? 'NEW' : i % 4 === 1 ? 'CONTACTED' : i % 4 === 2 ? 'QUALIFIED' : 'ATTEMPTED_CONTACT',
  source: i % 3 === 0 ? 'WEBSITE' : i % 3 === 1 ? 'PAID_CAMPAIGN' : 'REFERRAL',
  createdAt: new Date(Date.now() - i * 3600000 * 5).toISOString()
}));

export interface GeneratedDealRecord {
  id: string;
  title: string;
  amount: number;
  stage: string;
  probability: number;
  weightedValue: number;
  ownerId: string;
  expectedCloseDate: string;
}

export const GENERATED_ENTERPRISE_DEALS: GeneratedDealRecord[] = Array.from({ length: 800 }, (_, i) => {
  const amount = 25000 + (i * 3500);
  const probabilities = [10, 30, 60, 85, 100, 0];
  const stages = ['DISCOVERY', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
  const stageIdx = i % 6;
  const probability = probabilities[stageIdx];
  return {
    id: `gen_deal_${20000 + i}`,
    title: `Enterprise Cloud Solution - Contract Phase ${i + 1}`,
    amount,
    stage: stages[stageIdx],
    probability,
    weightedValue: (amount * probability) / 100,
    ownerId: `user_rep_${1 + (i % 10)}`,
    expectedCloseDate: new Date(Date.now() + (i % 90) * 86400000).toISOString()
  };
});
