/**
 * Partner Deal Registration & Referral Portal
 */

export interface RegisteredDeal {
  id: string;
  partnerId: string;
  leadName: string;
  expectedARRUSD: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
}

export class PartnerPortalEngine {
  private registeredDeals: Map<string, RegisteredDeal> = new Map();

  public registerDeal(deal: Omit<RegisteredDeal, 'status'>): RegisteredDeal {
    const record: RegisteredDeal = { ...deal, status: 'PENDING_APPROVAL' };
    this.registeredDeals.set(deal.id, record);
    return record;
  }

  public approveDeal(dealId: string): RegisteredDeal {
    const deal = this.registeredDeals.get(dealId);
    if (!deal) throw new Error('Deal registration not found');
    deal.status = 'APPROVED';
    return deal;
  }
}
