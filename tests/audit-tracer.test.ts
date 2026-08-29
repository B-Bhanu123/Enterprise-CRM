import { AuditTracerEngine } from '../src/modules/audit_tracer';
import { SecurityAuditEngine } from '../src/modules/security_audit';

describe('Audit Tracer & Security Compliance Engine', () => {
  it('should accurately capture audit logs for user entities', () => {
    const tracer = new AuditTracerEngine();
    tracer.logAction({
      userId: 'USR-101',
      action: 'UPDATE_DEAL_STAGE',
      entityType: 'DEAL',
      entityId: 'DEAL-99',
      ipAddress: '192.168.1.1'
    });

    const logs = tracer.getEntityHistory('DEAL-99');
    expect(logs.length).toBe(1);
    expect(logs[0].action).toBe('UPDATE_DEAL_STAGE');
  });

  it('should mask PII sensitivity fields correctly for SOC2 compliance', () => {
    const sec = new SecurityAuditEngine();
    const masked = sec.maskPII('Contact customer at alice@enterprise.com or 555-123-4567');
    expect(masked.includes('alice@enterprise.com')).toBe(false);
    expect(masked.includes('555-123-4567')).toBe(false);
  });
});
