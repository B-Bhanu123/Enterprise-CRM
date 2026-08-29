import { CPQEngine } from '../src/modules/quote_cpq';
import { BillingEngine } from '../src/modules/billing_engine';

describe('Quote CPQ & Billing Engine', () => {
  it('should apply volume discount correctly in CPQ calculation', () => {
    const cpq = new CPQEngine();
    const totals = cpq.calculateQuoteTotals({
      id: 'QT-101',
      dealId: 'DEAL-500',
      lineItems: [
        { productId: 'PROD-SEATS', unitPriceUSD: 100, quantity: 100 } // 100 seats => 20% discount
      ],
      paymentTermDays: 30
    });

    expect(totals.subtotal).toBe(10000);
    expect(totals.totalDiscount).toBe(2000);
    expect(totals.grandTotal).toBe(8000);
  });

  it('should calculate annual recurring revenue (ARR) from subscription MRR', () => {
    const billing = new BillingEngine();
    billing.createSubscription({
      id: 'SUB-1',
      accountId: 'ACC-99',
      planId: 'ENTERPRISE',
      mrrUSD: 5000,
      billingIntervalMonths: 1,
      status: 'ACTIVE'
    });

    const arr = billing.calculateARR('ACC-99');
    expect(arr).toBe(60000);
  });
});
