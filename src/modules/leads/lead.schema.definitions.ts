/**
 * Enterprise Lead Schema & Domain Definitions
 */

export interface IndustryBenchmark {
  industryCode: string;
  industryName: string;
  averageDealSize: number;
  averageSalesCycleDays: number;
  expectedConversionRate: number;
  leadScoringMultiplier: number;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = Array.from({ length: 250 }, (_, i) => ({
  industryCode: `IND_${1000 + i}`,
  industryName: `Industry Vertical ${i + 1} - Enterprise Sector`,
  averageDealSize: 50000 + i * 2500,
  averageSalesCycleDays: 30 + (i % 60),
  expectedConversionRate: 15 + (i % 25),
  leadScoringMultiplier: 1.0 + (i % 10) * 0.1,
  riskTier: i % 3 === 0 ? 'LOW' : i % 3 === 1 ? 'MEDIUM' : 'HIGH'
}));

export interface LeadQualificationMatrix {
  bantCriteria: {
    budgetConfirmed: boolean;
    authorityIdentified: boolean;
    needValidated: boolean;
    timelineMonths: number;
  };
  competingSolutions: string[];
  buyingRole: 'DECISION_MAKER' | 'INFLUENCER' | 'CHAMPION' | 'BLOCKER' | 'END_USER';
}

export const GENERATED_QUALIFICATION_MATRICES: LeadQualificationMatrix[] = Array.from({ length: 500 }, (_, i) => ({
  bantCriteria: {
    budgetConfirmed: i % 2 === 0,
    authorityIdentified: i % 3 !== 0,
    needValidated: true,
    timelineMonths: 1 + (i % 12)
  },
  competingSolutions: [`Competitor Solution ${i % 10}`, `Legacy System ${i % 5}`],
  buyingRole: i % 5 === 0 ? 'DECISION_MAKER' : i % 5 === 1 ? 'CHAMPION' : 'INFLUENCER'
}));
