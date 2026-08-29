/**
 * Enterprise Contact & Account Schema Definitions
 */

export interface CorporateAccountHierarchySpec {
  hierarchyId: string;
  globalUltimateParentId: string;
  subsidiaryCount: number;
  globalEmployeeTotal: number;
  consolidatedARR: number;
  complianceRegion: 'NAM' | 'EMEA' | 'APAC' | 'LATAM';
}

export const CORPORATE_HIERARCHIES: CorporateAccountHierarchySpec[] = Array.from({ length: 300 }, (_, i) => ({
  hierarchyId: `HIER_${5000 + i}`,
  globalUltimateParentId: `PARENT_ACC_${100 + i}`,
  subsidiaryCount: 2 + (i % 15),
  globalEmployeeTotal: 500 + i * 50,
  consolidatedARR: 1000000 + i * 150000,
  complianceRegion: i % 4 === 0 ? 'NAM' : i % 4 === 1 ? 'EMEA' : i % 4 === 2 ? 'APAC' : 'LATAM'
}));
