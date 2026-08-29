import { CampaignAutomationEngine } from '../src/modules/campaign_automation';

describe('Omnichannel Campaign Automation Engine', () => {
  it('should calculate conversion rate percentage accurately', () => {
    const engine = new CampaignAutomationEngine();
    engine.createCampaign({
      id: 'CAMP-FINTECH',
      name: 'Q3 Fintech Lead Nurture',
      targetIndustry: 'Financial Services',
      dripSteps: [
        { stepNumber: 1, delayHours: 0, channel: 'EMAIL', templateId: 'TMPL-WELCOME' },
        { stepNumber: 2, delayHours: 48, channel: 'SMS', templateId: 'TMPL-DEMO-REMINDER' }
      ],
      status: 'ACTIVE'
    });

    for (let i = 0; i < 100; i++) engine.recordEngagement('CAMP-FINTECH', 'sentCount');
    for (let i = 0; i < 15; i++) engine.recordEngagement('CAMP-FINTECH', 'convertedCount');

    const conversionRate = engine.calculateConversionRate('CAMP-FINTECH');
    expect(conversionRate).toBe(15);
  });
});
