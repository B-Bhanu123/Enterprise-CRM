/**
 * Territory Management & Assignment Engine
 */

export interface Territory {
  id: string;
  name: string;
  regionCode: string;
  postalCodes: string[];
  quotaTargetUSD: number;
  assignedRepIds: string[];
}

export interface TerritoryAssignmentRule {
  territoryId: string;
  postalCodePrefixes: string[];
  minCompanyRevenue: number;
}

export class TerritoryManagementEngine {
  private territories: Map<string, Territory> = new Map();
  private assignmentRules: TerritoryAssignmentRule[] = [];

  public createTerritory(territory: Territory): Territory {
    this.territories.set(territory.id, territory);
    return territory;
  }

  public addRule(rule: TerritoryAssignmentRule): void {
    this.assignmentRules.push(rule);
  }

  public assignLeadToTerritory(postalCode: string, annualRevenue: number): string | null {
    for (const rule of this.assignmentRules) {
      const matchesPostal = rule.postalCodePrefixes.some(prefix => postalCode.startsWith(prefix));
      if (matchesPostal && annualRevenue >= rule.minCompanyRevenue) {
        return rule.territoryId;
      }
    }
    return null;
  }

  public calculateQuotaAttainment(territoryId: string, totalClosedWonUSD: number): number {
    const territory = this.territories.get(territoryId);
    if (!territory || territory.quotaTargetUSD === 0) return 0;
    return Math.round((totalClosedWonUSD / territory.quotaTargetUSD) * 100);
  }
}
