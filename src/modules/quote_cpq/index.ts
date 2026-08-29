/**
 * Configure, Price, Quote (CPQ) Engine
 */

export interface LineItem {
  productId: string;
  unitPriceUSD: number;
  quantity: number;
  discountPercentage?: number;
}

export interface Quote {
  id: string;
  dealId: string;
  lineItems: LineItem[];
  paymentTermDays: number;
}

export class CPQEngine {
  public calculateQuoteTotals(quote: Quote): { subtotal: number; totalDiscount: number; grandTotal: number } {
    let subtotal = 0;
    let totalDiscount = 0;

    for (const item of quote.lineItems) {
      const itemSubtotal = item.unitPriceUSD * item.quantity;
      subtotal += itemSubtotal;

      // Tiered discount lookup
      let discountPct = item.discountPercentage || 0;
      if (item.quantity >= 100) discountPct = Math.max(discountPct, 20);
      else if (item.quantity >= 50) discountPct = Math.max(discountPct, 10);

      const discountAmt = (itemSubtotal * discountPct) / 100;
      totalDiscount += discountAmt;
    }

    const grandTotal = subtotal - totalDiscount;
    return { subtotal, totalDiscount, grandTotal };
  }
}
