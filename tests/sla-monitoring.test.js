"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_entity_js_1 = require("../src/modules/tickets/ticket.entity.js");
describe('Test Case 6: Support SLA Monitoring & Breach Calculation Verification', () => {
    it('should enforce strict SLA thresholds by priority level', () => {
        const urgentSLA = ticket_entity_js_1.SLA_THRESHOLDS[ticket_entity_js_1.TicketPriority.URGENT];
        const highSLA = ticket_entity_js_1.SLA_THRESHOLDS[ticket_entity_js_1.TicketPriority.HIGH];
        const mediumSLA = ticket_entity_js_1.SLA_THRESHOLDS[ticket_entity_js_1.TicketPriority.MEDIUM];
        const lowSLA = ticket_entity_js_1.SLA_THRESHOLDS[ticket_entity_js_1.TicketPriority.LOW];
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
