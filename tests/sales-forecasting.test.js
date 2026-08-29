"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forecasting_engine_js_1 = require("../src/modules/deals/forecasting.engine.js");
const deal_entity_js_1 = require("../src/modules/deals/deal.entity.js");
const common_types_js_1 = require("../src/core/types/common.types.js");
describe('Test Case 3: Sales Pipeline Forecasting & Win Rate Verification', () => {
    it('should accurately calculate weighted pipeline value, win rate, and deal metrics', () => {
        const deals = [
            {
                id: 'deal_1',
                title: 'Deal 1',
                amount: 100000,
                currency: common_types_js_1.Currency.USD,
                stage: deal_entity_js_1.PipelineStage.DISCOVERY,
                probability: 10,
                expectedCloseDate: '2026-10-01',
                type: deal_entity_js_1.DealType.NEW_BUSINESS,
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
                currency: common_types_js_1.Currency.USD,
                stage: deal_entity_js_1.PipelineStage.PROPOSAL,
                probability: 60,
                expectedCloseDate: '2026-09-15',
                type: deal_entity_js_1.DealType.NEW_BUSINESS,
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
                currency: common_types_js_1.Currency.USD,
                stage: deal_entity_js_1.PipelineStage.CLOSED_WON,
                probability: 100,
                expectedCloseDate: '2026-08-20',
                actualCloseDate: '2026-08-20',
                type: deal_entity_js_1.DealType.NEW_BUSINESS,
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
                currency: common_types_js_1.Currency.USD,
                stage: deal_entity_js_1.PipelineStage.CLOSED_LOST,
                probability: 0,
                expectedCloseDate: '2026-08-15',
                actualCloseDate: '2026-08-15',
                type: deal_entity_js_1.DealType.NEW_BUSINESS,
                accountId: 'acc_4',
                ownerId: 'rep_2',
                weightedValue: 0,
                stageHistory: [],
                createdAt: '2026-08-01',
                updatedAt: '2026-08-15'
            }
        ];
        const metrics = forecasting_engine_js_1.ForecastingEngine.calculateForecast(deals);
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
