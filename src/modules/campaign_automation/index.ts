/**
 * Omnichannel Drip Campaign Automation Engine
 */

export interface DripStep {
  stepNumber: number;
  delayHours: number;
  channel: 'EMAIL' | 'SMS' | 'LINKEDIN';
  templateId: string;
}

export interface Campaign {
  id: string;
  name: string;
  targetIndustry: string;
  dripSteps: DripStep[];
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
}

export interface CampaignMetrics {
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  convertedCount: number;
}

export class CampaignAutomationEngine {
  private campaigns: Map<string, Campaign> = new Map();
  private metrics: Map<string, CampaignMetrics> = new Map();

  public createCampaign(campaign: Campaign): Campaign {
    this.campaigns.set(campaign.id, campaign);
    this.metrics.set(campaign.id, { sentCount: 0, openedCount: 0, clickedCount: 0, convertedCount: 0 });
    return campaign;
  }

  public recordEngagement(campaignId: string, type: keyof CampaignMetrics): void {
    const current = this.metrics.get(campaignId);
    if (current) {
      current[type]++;
    }
  }

  public calculateConversionRate(campaignId: string): number {
    const m = this.metrics.get(campaignId);
    if (!m || m.sentCount === 0) return 0;
    return Number(((m.convertedCount / m.sentCount) * 100).toFixed(2));
  }
}
