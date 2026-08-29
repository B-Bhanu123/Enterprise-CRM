/**
 * Immutable Activity Audit Tracer Engine
 */

export interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  ipAddress: string;
  changes?: Record<string, { old: any; new: any }>;
}

export class AuditTracerEngine {
  private auditLog: AuditEntry[] = [];

  public logAction(entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry {
    const record: AuditEntry = {
      ...entry,
      id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLog.push(record);
    return record;
  }

  public getEntityHistory(entityId: string): AuditEntry[] {
    return this.auditLog.filter(log => log.entityId === entityId);
  }
}
