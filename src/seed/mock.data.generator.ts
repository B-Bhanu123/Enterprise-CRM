import { AuthService } from '../modules/auth/auth.service.js';
import { LeadService } from '../modules/leads/lead.service.js';
import { ContactService } from '../modules/contacts/contact.service.js';
import { AccountService } from '../modules/contacts/account.service.js';
import { DealService } from '../modules/deals/deal.service.js';
import { TicketService } from '../modules/tickets/ticket.service.js';
import { CampaignService } from '../modules/campaigns/campaign.service.js';
import { WorkflowService } from '../modules/workflows/workflow.service.js';
import { UserRole } from '../modules/auth/user.model.js';
import { LeadSource } from '../modules/leads/lead.entity.js';
import { PipelineStage, DealType } from '../modules/deals/deal.entity.js';
import { TicketCategory, TicketPriority } from '../modules/tickets/ticket.entity.js';
import { LoggerService } from '../core/logger/logger.service.js';

export class MockDataGenerator {
  private static logger = LoggerService.getInstance();

  public static seedEnterpriseData(): void {
    this.logger.info('MockDataGenerator', 'Starting enterprise CRM mock dataset generator...');

    const authService = AuthService.getInstance();
    const leadService = LeadService.getInstance();
    const contactService = ContactService.getInstance();
    const accountService = AccountService.getInstance();
    const dealService = DealService.getInstance();
    const ticketService = TicketService.getInstance();
    const campaignService = CampaignService.getInstance();
    const workflowService = WorkflowService.getInstance();

    // 1. Create Sales Rep Users
    const rep1 = authService.register({
      email: 'john.sales@enterprisecrm.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.SALES_REP,
      department: 'Enterprise Sales'
    });

    const rep2 = authService.register({
      email: 'alice.manager@enterprisecrm.com',
      password: 'Password123!',
      firstName: 'Alice',
      lastName: 'Smith',
      role: UserRole.SALES_MANAGER,
      department: 'Sales Leadership'
    });

    // 2. Create Corporate Accounts
    const acc1 = accountService.createAccount({
      name: 'Acme Global Software Inc',
      domain: 'acmeglobal.com',
      industry: 'Software',
      employeeCount: 2500,
      annualRevenue: 50000000,
      ownerId: rep1.id
    });

    const acc2 = accountService.createAccount({
      name: 'Apex Financial Services',
      domain: 'apexfinance.io',
      industry: 'Finance',
      employeeCount: 12000,
      annualRevenue: 450000000,
      ownerId: rep2.id
    });

    // 3. Create Contacts
    const c1 = contactService.createContact({
      firstName: 'David',
      lastName: 'Miller',
      email: 'david.miller@acmeglobal.com',
      title: 'Chief Technology Officer',
      accountId: acc1.id,
      ownerId: rep1.id
    });

    const c2 = contactService.createContact({
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena.r@apexfinance.io',
      title: 'VP of Information Security',
      accountId: acc2.id,
      ownerId: rep2.id
    });

    // 4. Create Leads
    leadService.createLead({
      firstName: 'Robert',
      lastName: 'Johnson',
      title: 'VP of Infrastructure',
      email: 'rjohnson@cybertech.org',
      companyName: 'CyberTech Security',
      industry: 'Technology',
      employeeCount: 650,
      annualRevenue: 15000000,
      source: LeadSource.WEBSITE
    }, rep1.id);

    leadService.createLead({
      firstName: 'Sophia',
      lastName: 'Martinez',
      title: 'Director of Operations',
      email: 'smartinez@logisticsx.com',
      companyName: 'LogisticsX Freight',
      industry: 'Manufacturing',
      employeeCount: 320,
      annualRevenue: 8500000,
      source: LeadSource.PAID_CAMPAIGN
    }, rep2.id);

    // 5. Create Sales Deals
    dealService.createDeal({
      title: 'Acme Cloud Platform License',
      amount: 450000,
      stage: PipelineStage.PROPOSAL,
      expectedCloseDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      type: DealType.NEW_BUSINESS,
      accountId: acc1.id,
      primaryContactId: c1.id,
      ownerId: rep1.id
    });

    dealService.createDeal({
      title: 'Apex Financial Security Suite',
      amount: 1250000,
      stage: PipelineStage.NEGOTIATION,
      expectedCloseDate: new Date(Date.now() + 86400000 * 15).toISOString(),
      type: DealType.NEW_BUSINESS,
      accountId: acc2.id,
      primaryContactId: c2.id,
      ownerId: rep2.id
    });

    // 6. Support Tickets
    ticketService.createTicket({
      subject: 'SSO Authentication Integration Error',
      description: 'Customer encountering 403 Forbidden error during Okta SAML callback',
      priority: TicketPriority.HIGH,
      category: TicketCategory.TECHNICAL_ISSUE,
      contactId: c1.id,
      accountId: acc1.id
    });

    // 7. Email Campaign
    const camp = campaignService.createCampaign({
      name: 'Q3 Enterprise CRM Upgrade Announcement',
      subject: 'Unlock Next-Gen AI Sales Workflows with OmniCRM',
      templateContent: '<h1>Special Enterprise Offer</h1><p>Upgrade today for 20% off.</p>'
    });
    campaignService.launchCampaign(camp.id);

    this.logger.info('MockDataGenerator', 'Enterprise seed data generation completed successfully!');
  }
}
