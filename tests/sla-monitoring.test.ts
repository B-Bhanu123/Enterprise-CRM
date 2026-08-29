import { SLA_THRESHOLDS, TicketPriority } from '../src/modules/tickets/ticket.entity.js';

describe('Test Case 6: Support SLA Monitoring & Breach Calculation Verification', () => {
  it('should enforce strict SLA thresholds by priority level', () => {
    const urgentSLA = SLA_THRESHOLDS[TicketPriority.URGENT];
    const highSLA = SLA_THRESHOLDS[TicketPriority.HIGH];
    const mediumSLA = SLA_THRESHOLDS[TicketPriority.MEDIUM];
    const lowSLA = SLA_THRESHOLDS[TicketPriority.LOW];

    // Urgent tickets require <= 1h response and <= 4h resolution
    expect(urgentSLA.responseHours).toBe(1);
    expect(urgentSLA.resolutionHours).toBe(4);

    // High priority requires <= 4h response and <= 16h resolution
    expect(highSLA.responseHours).toBe(4);
    expect(highSLA.resolutionHours).toBe(16);

    expect(mediumSLA.responseHours).toBe(12);
    expect(lowSLA.responseHours).toBe(24);
  });
});
