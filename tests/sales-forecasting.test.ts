import { ForecastingEngine } from '../src/modules/deals/forecasting.engine.js';
import { DealEntity, DealType, PipelineStage } from '../src/modules/deals/deal.entity.js';
import { Currency } from '../src/core/types/common.types.js';

describe('Test Case 3: Sales Pipeline Forecasting & Win Rate Verification', () => {
  it('should accurately calculate weighted pipeline value, win rate, and deal metrics', () => {
    const deals: DealEntity[] = [
      {
        id: 'deal_1',
        title: 'Deal 1',
        amount: 100000,
        currency: Currency.USD,
        stage: PipelineStage.DISCOVERY,
        probability: 10,
        expectedCloseDate: '2026-10-01',
        type: DealType.NEW_BUSINESS,
        accountId: 'acc_1',
        ownerId: 'rep_1',
        weightedValue: 10000,
        stageHistory: [],
        createdAt: '2026-08-01',
        updatedAt: '2026-08-01'
      },
      {
        id: 'deal_2',
        title: 'Deal 2',
        amount: 200000,
        currency: Currency.USD,
        stage: PipelineStage.PROPOSAL,
        probability: 60,
        expectedCloseDate: '2026-09-15',
        type: DealType.NEW_BUSINESS,
        accountId: 'acc_2',
        ownerId: 'rep_1',
        weightedValue: 120000,
        stageHistory: [],
        createdAt: '2026-08-01',
        updatedAt: '2026-08-01'
      },
      {
        id: 'deal_3',
        title: 'Deal 3',
        amount: 300000,
        currency: Currency.USD,
        stage: PipelineStage.CLOSED_WON,
        probability: 100,
        expectedCloseDate: '2026-08-20',
        actualCloseDate: '2026-08-20',
        type: DealType.NEW_BUSINESS,
        accountId: 'acc_3',
        ownerId: 'rep_2',
        weightedValue: 300000,
        stageHistory: [],
        createdAt: '2026-08-01',
        updatedAt: '2026-08-20'
      },
      {
        id: 'deal_4',
        title: 'Deal 4',
        amount: 100000,
        currency: Currency.USD,
        stage: PipelineStage.CLOSED_LOST,
        probability: 0,
        expectedCloseDate: '2026-08-15',
        actualCloseDate: '2026-08-15',
        type: DealType.NEW_BUSINESS,
        accountId: 'acc_4',
        ownerId: 'rep_2',
        weightedValue: 0,
        stageHistory: [],
        createdAt: '2026-08-01',
        updatedAt: '2026-08-15'
      }
    ];

    const metrics = ForecastingEngine.calculateForecast(deals);

    // Active pipeline = Deal 1 ($100k) + Deal 2 ($200k) = $300,000
    expect(metrics.totalPipelineValue).toBe(300000);
    
    // Weighted forecast = Deal 1 ($10k) + Deal 2 ($120k) = $130,000
    expect(metrics.weightedForecastValue).toBe(130000);

    // Closed won value = $300,000
    expect(metrics.closedWonValue).toBe(300000);

    // Win rate = 1 won out of 2 closed (1 won + 1 lost) = 50%
    expect(metrics.winRatePercentage).toBe(50);
  });
});
