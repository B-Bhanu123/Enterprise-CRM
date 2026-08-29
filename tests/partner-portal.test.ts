import { PartnerPortalEngine } from '../src/modules/partner_portal';
import { NPSSurveyEngine } from '../src/modules/nps_survey';

describe('Partner Portal & NPS Survey Engine', () => {
  it('should process partner deal registration and status approval', () => {
    const portal = new PartnerPortalEngine();
    portal.registerDeal({
      id: 'REG-88',
      partnerId: 'PTR-01',
      leadName: 'Acme MegaCorp',
      expectedARRUSD: 150000
    });

    const approved = portal.approveDeal('REG-88');
    expect(approved.status).toBe('APPROVED');
  });

  it('should calculate accurate Net Promoter Score (NPS)', () => {
    const npsEngine = new NPSSurveyEngine();
    npsEngine.submitResponse({ responseId: '1', contactId: 'C1', score: 10 }); // Promoter
    npsEngine.submitResponse({ responseId: '2', contactId: 'C2', score: 9 });  // Promoter
    npsEngine.submitResponse({ responseId: '3', contactId: 'C3', score: 7 });  // Passive
    npsEngine.submitResponse({ responseId: '4', contactId: 'C4', score: 4 });  // Detractor

    // 2 promoters (50%), 1 detractor (25%) => NPS = +25
    const nps = npsEngine.calculateNPS();
    expect(nps).toBe(25);
  });
});
