import { MemoryDatabase } from '../../core/database/memory.db.js';
import { LeadService } from '../leads/lead.service.js';
import { ContactService } from '../contacts/contact.service.js';
import { AccountService } from '../contacts/account.service.js';
import { DealService } from '../deals/deal.service.js';
import { TicketService } from '../tickets/ticket.service.js';
import { CampaignService } from '../campaigns/campaign.service.js';
import { ExecutiveDashboardSummary, FunnelStageMetric, SalesRepLeaderboardEntry } from './report.definition.js';
import { PipelineStage } from '../deals/deal.entity.js';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private db = MemoryDatabase.getInstance();
  private leadService = LeadService.getInstance();
  private contactService = ContactService.getInstance();
  private accountService = AccountService.getInstance();
  private dealService = DealService.getInstance();
  private ticketService = TicketService.getInstance();
  private campaignService = CampaignService.getInstance();

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public getExecutiveSummary(tenantId?: string): ExecutiveDashboardSummary {
    const leads = this.leadService.queryLeads({ tenantId, limit: 10000 });
    const contacts = this.contactService.queryContacts({ tenantId, limit: 10000 });
    const accounts = this.accountService.queryAccounts({ tenantId, limit: 10000 });
    const deals = this.dealService.queryDeals({ tenantId, limit: 10000 });
    const tickets = this.ticketService.queryTickets({ tenantId, limit: 10000 });
    const campaigns = this.campaignService.queryCampaigns({ tenantId, limit: 10000 });

    const forecast = this.dealService.getForecast(tenantId);

    const activeDeals = deals.data.filter(
      (d) => d.stage !== PipelineStage.CLOSED_WON && d.stage !== PipelineStage.CLOSED_LOST
    );

    const openTickets = tickets.data.filter((t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED');
    const slaBreached = tickets.data.filter((t) => t.isResponseSLABreached || t.isResolutionSLABreached);
    const activeCampaigns = campaigns.data.filter((c) => c.status === 'ACTIVE');

    return {
      totalLeads: leads.total,
      totalContacts: contacts.total,
      totalAccounts: accounts.total,
      totalActiveDeals: activeDeals.length,
      totalPipelineARR: forecast.totalPipelineValue,
      totalClosedWonARR: forecast.closedWonValue,
      winRatePercentage: forecast.winRatePercentage,
      openSupportTickets: openTickets.length,
      slabreachedTickets: slaBreached.length,
      activeCampaignsCount: activeCampaigns.length
    };
  }

  public getSalesFunnelBreakdown(tenantId?: string): FunnelStageMetric[] {
    const forecast = this.dealService.getForecast(tenantId);
    const stages = Object.values(PipelineStage);
    const result: FunnelStageMetric[] = [];

    let prevCount = 0;

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const info = forecast.byStage[stage];
      const count = info ? info.count : 0;

      let conversionRate = 100;
      if (i > 0 && prevCount > 0) {
        conversionRate = Math.round((count / prevCount) * 100);
      }

      result.push({
        stageName: stage,
        count,
        conversionRateFromPrevious: conversionRate,
        totalValue: info ? info.totalValue : 0
      });

      if (count > 0) prevCount = count;
    }

    return result;
  }
}
