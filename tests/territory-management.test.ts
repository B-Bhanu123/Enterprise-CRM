import { TerritoryManagementEngine } from '../src/modules/territory_management';

describe('Territory Management Engine', () => {
  let engine: TerritoryManagementEngine;

  beforeEach(() => {
    engine = new TerritoryManagementEngine();
    engine.createTerritory({
      id: 'TERR-NA-EAST',
      name: 'North America East',
      regionCode: 'US-EST',
      postalCodes: ['10001', '10002', '10003'],
      quotaTargetUSD: 1000000,
      assignedRepIds: ['rep_01', 'rep_02']
    });

    engine.addRule({
      territoryId: 'TERR-NA-EAST',
      postalCodePrefixes: ['100'],
      minCompanyRevenue: 500000
    });
  });

  it('should auto-assign lead to territory based on postal code and revenue', () => {
    const territoryId = engine.assignLeadToTerritory('10001', 750000);
    expect(territoryId).toBe('TERR-NA-EAST');
  });

  it('should calculate accurate quota attainment percentage', () => {
    const attainment = engine.calculateQuotaAttainment('TERR-NA-EAST', 750000);
    expect(attainment).toBe(75);
  });
});
