import { MemoryDatabase } from '../../core/database/memory.db.js';
import { UserEntity, UserRole } from '../auth/user.model.js';
import { LeadEntity } from './lead.entity.js';
import { LoggerService } from '../../core/logger/logger.service.js';

export class LeadAssignmentEngine {
  private static db = MemoryDatabase.getInstance();
  private static logger = LoggerService.getInstance();

  /**
   * Round-robin assignment to active Sales Reps with workload balancing
   */
  public static assignLead(lead: LeadEntity): string | undefined {
    const salesReps = this.db.query<UserEntity>('users', {
      filters: [
        { field: 'role', operator: 'eq', value: UserRole.SALES_REP },
        { field: 'isActive', operator: 'eq', value: true }
      ],
      tenantId: lead.tenantId
    });

    if (salesReps.total === 0) {
      this.logger.warn('LeadAssignmentEngine', `No active sales reps found for tenant ${lead.tenantId}`);
      return undefined;
    }

    // Find sales rep with minimum assigned active leads
    let selectedRepId = salesReps.data[0].id;
    let minWorkload = Infinity;

    for (const rep of salesReps.data) {
      const activeLeads = this.db.query<LeadEntity>('leads', {
        filters: [
          { field: 'assignedTo', operator: 'eq', value: rep.id },
          { field: 'status', operator: 'ne', value: 'CONVERTED' },
          { field: 'status', operator: 'ne', value: 'UNQUALIFIED' }
        ]
      });

      if (activeLeads.total < minWorkload) {
        minWorkload = activeLeads.total;
        selectedRepId = rep.id;
      }
    }

    this.logger.info('LeadAssignmentEngine', `Lead '${lead.id}' auto-assigned to sales rep '${selectedRepId}' (Workload: ${minWorkload})`);
    return selectedRepId;
  }
}
