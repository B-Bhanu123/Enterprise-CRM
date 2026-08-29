export interface ExecutiveDashboardSummary {
  totalLeads: number;
  totalContacts: number;
  totalAccounts: number;
  totalActiveDeals: number;
  totalPipelineARR: number;
  totalClosedWonARR: number;
  winRatePercentage: number;
  openSupportTickets: number;
  slabreachedTickets: number;
  activeCampaignsCount: number;
}

export interface FunnelStageMetric {
  stageName: string;
  count: number;
  conversionRateFromPrevious: number;
  totalValue?: number;
}

export interface SalesRepLeaderboardEntry {
  repId: string;
  repName: string;
  dealsWonCount: number;
  totalRevenueWon: number;
  winRatePercentage: number;
  averageDealCycleDays: number;
}
