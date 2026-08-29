import { LeadEntity, LeadRating } from './lead.entity.js';

export class LeadScoringEngine {
  /**
   * Calculates dynamic lead score from 0 to 100 based on weighted metrics
   */
  public static calculateScore(lead: LeadEntity): { score: number; rating: LeadRating } {
    let firmographicScore = 0;
    let demographicScore = 0;
    let engagementScore = 0;

    // 1. Firmographic Evaluation (Max 35 points)
    const { employeeCount = 0, annualRevenue = 0, industry } = lead.firmographics;

    if (employeeCount >= 500) firmographicScore += 15;
    else if (employeeCount >= 100) firmographicScore += 10;
    else if (employeeCount >= 20) firmographicScore += 5;

    if (annualRevenue >= 10000000) firmographicScore += 15;
    else if (annualRevenue >= 1000000) firmographicScore += 10;
    else if (annualRevenue >= 250000) firmographicScore += 5;

    const targetIndustries = ['Technology', 'Finance', 'Healthcare', 'Software', 'Manufacturing'];
    if (industry && targetIndustries.some((i) => i.toLowerCase() === industry.toLowerCase())) {
      firmographicScore += 5;
    }

    // 2. Demographic / Title Evaluation (Max 30 points)
    const title = (lead.title || '').toLowerCase();
    const decisionMakerKeywords = ['cxo', 'chief', 'vp', 'vice president', 'director', 'head', 'founder', 'owner'];
    const influencerKeywords = ['manager', 'lead', 'senior', 'architect', 'supervisor'];

    if (decisionMakerKeywords.some((kw) => title.includes(kw))) {
      demographicScore += 25;
    } else if (influencerKeywords.some((kw) => title.includes(kw))) {
      demographicScore += 15;
    } else {
      demographicScore += 5;
    }

    if (lead.phone) demographicScore += 5;

    // 3. Behavioral Engagement Evaluation (Max 35 points)
    const metrics = lead.behavioralMetrics;
    engagementScore += Math.min(metrics.emailOpensCount * 2, 8);
    engagementScore += Math.min(metrics.linkClicksCount * 3, 9);
    engagementScore += Math.min(metrics.pageViewsCount * 1, 8);
    engagementScore += Math.min(metrics.meetingsScheduledCount * 10, 10);

    const totalScore = Math.min(Math.max(firmographicScore + demographicScore + engagementScore, 0), 100);

    // Determine Rating
    let rating: LeadRating;
    if (totalScore >= 70) {
      rating = LeadRating.HOT;
    } else if (totalScore >= 40) {
      rating = LeadRating.WARM;
    } else {
      rating = LeadRating.COLD;
    }

    return { score: totalScore, rating };
  }
}
