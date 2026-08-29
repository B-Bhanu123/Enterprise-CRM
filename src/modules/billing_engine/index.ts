/**
 * SaaS Recurring Subscription Billing Manager
 */

export interface Subscription {
  id: string;
  accountId: string;
  planId: string;
  mrrUSD: number;
  billingIntervalMonths: number;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';
}

export class BillingEngine {
  private subscriptions: Map<string, Subscription> = new Map();

  public createSubscription(sub: Subscription): Subscription {
    this.subscriptions.set(sub.id, sub);
    return sub;
  }

  public calculateARR(accountId: string): number {
    let totalARR = 0;
    for (const sub of this.subscriptions.values()) {
      if (sub.accountId === accountId && sub.status === 'ACTIVE') {
        totalARR += sub.mrrUSD * 12;
      }
    }
    return totalARR;
  }
}
