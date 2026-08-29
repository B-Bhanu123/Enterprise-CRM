/**
 * Enterprise Synthetic Tickets Dataset Registry
 */

export interface GeneratedTicketRecord {
  id: string;
  ticketNumber: string;
  subject: string;
  priority: string;
  status: string;
  category: string;
  isSLABreached: boolean;
  createdAt: string;
}

export const GENERATED_ENTERPRISE_TICKETS: GeneratedTicketRecord[] = Array.from({ length: 800 }, (_, i) => ({
  id: `gen_tick_${30000 + i}`,
  ticketNumber: `TICK-${100000 + i}`,
  subject: `Support Escalation Ticket #${i + 1} - Enterprise Infrastructure Incompatibility`,
  priority: i % 4 === 0 ? 'URGENT' : i % 4 === 1 ? 'HIGH' : i % 4 === 2 ? 'MEDIUM' : 'LOW',
  status: i % 3 === 0 ? 'OPEN' : i % 3 === 1 ? 'IN_PROGRESS' : 'RESOLVED',
  category: i % 3 === 0 ? 'TECHNICAL' : i % 3 === 1 ? 'BILLING' : 'FEATURE_REQUEST',
  isSLABreached: i % 7 === 0,
  createdAt: new Date(Date.now() - i * 3600000 * 3).toISOString()
}));
