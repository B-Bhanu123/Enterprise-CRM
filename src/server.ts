import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { AuthService } from './modules/auth/auth.service.js';
import { LeadService } from './modules/leads/lead.service.js';
import { ContactService } from './modules/contacts/contact.service.js';
import { AccountService } from './modules/contacts/account.service.js';
import { DealService } from './modules/deals/deal.service.js';
import { TicketService } from './modules/tickets/ticket.service.js';
import { CampaignService } from './modules/campaigns/campaign.service.js';
import { WorkflowService } from './modules/workflows/workflow.service.js';
import { AnalyticsService } from './modules/analytics/analytics.service.js';
import { MockDataGenerator } from './seed/mock.data.generator.js';
import { LoggerService } from './core/logger/logger.service.js';
import { RBACMiddleware } from './modules/auth/rbac.middleware.js';
import { Permission } from './modules/auth/user.model.js';

const app = express();
const PORT = process.env.PORT || 3000;
const logger = LoggerService.getInstance();

app.use(cors());
app.use(express.json());

// Initialize Services
const authService = AuthService.getInstance();
const leadService = LeadService.getInstance();
const contactService = ContactService.getInstance();
const accountService = AccountService.getInstance();
const dealService = DealService.getInstance();
const ticketService = TicketService.getInstance();
const campaignService = CampaignService.getInstance();
const workflowService = WorkflowService.getInstance();
const analyticsService = AnalyticsService.getInstance();

// Seed initial dataset
MockDataGenerator.seedEnterpriseData();

// --- API ROUTES ---

// Healthcheck
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Authentication
app.post('/api/v1/auth/register', (req: Request, res: Response) => {
  try {
    const user = authService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  try {
    const result = authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
});

// Leads API
app.get('/api/v1/leads', (req: Request, res: Response) => {
  try {
    const token = RBACMiddleware.authenticate(req.headers.authorization);
    RBACMiddleware.authorize(Permission.LEADS_READ, token);
    const leads = leadService.queryLeads(req.query as any);
    res.json({ success: true, ...leads });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/leads', (req: Request, res: Response) => {
  try {
    const token = RBACMiddleware.authenticate(req.headers.authorization);
    RBACMiddleware.authorize(Permission.LEADS_CREATE, token);
    const lead = leadService.createLead(req.body, token.userId);
    res.status(201).json({ success: true, data: lead });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
});

// Deals Pipeline API
app.get('/api/v1/deals', (req: Request, res: Response) => {
  try {
    const token = RBACMiddleware.authenticate(req.headers.authorization);
    RBACMiddleware.authorize(Permission.DEALS_READ, token);
    const deals = dealService.queryDeals(req.query as any);
    res.json({ success: true, ...deals });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/deals/forecast', (req: Request, res: Response) => {
  try {
    const token = RBACMiddleware.authenticate(req.headers.authorization);
    RBACMiddleware.authorize(Permission.DEALS_FORECAST, token);
    const forecast = dealService.getForecast(token.tenantId);
    res.json({ success: true, data: forecast });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
});

// Support Tickets API
app.get('/api/v1/tickets', (req: Request, res: Response) => {
  try {
    const token = RBACMiddleware.authenticate(req.headers.authorization);
    RBACMiddleware.authorize(Permission.TICKETS_READ, token);
    const tickets = ticketService.queryTickets(req.query as any);
    res.json({ success: true, ...tickets });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
});

// Executive Analytics Summary API
app.get('/api/v1/analytics/summary', (req: Request, res: Response) => {
  try {
    const token = RBACMiddleware.authenticate(req.headers.authorization);
    RBACMiddleware.authorize(Permission.ANALYTICS_VIEW, token);
    const summary = analyticsService.getExecutiveSummary(token.tenantId);
    res.json({ success: true, data: summary });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
});

// Serve Static Frontend Assets
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  logger.info('Server', `🚀 Enterprise CRM Server running at http://localhost:${PORT}`);
});

export default app;
