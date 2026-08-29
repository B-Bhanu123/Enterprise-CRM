import { DealEntity, PipelineStage } from './deal.entity.js';

export interface ForecastMetrics {
  totalDealsCount: number;
  totalPipelineValue: number;
  weightedForecastValue: number;
  closedWonValue: number;
  closedLostValue: number;
  winRatePercentage: number;
  averageDealSize: number;
  averageSalesCycleDays: number;
  byStage: Record<PipelineStage, { count: number; totalValue: number; weightedValue: number }>;
}

export class ForecastingEngine {
  public static calculateForecast(deals: DealEntity[], salesQuotaTarget: number = 1000000): ForecastMetrics {
    let totalPipelineValue = 0;
    let weightedForecastValue = 0;
    let closedWonValue = 0;
    let closedLostValue = 0;
    let closedWonCount = 0;
    let closedLostCount = 0;

    const byStage: Record<PipelineStage, { count: number; totalValue: number; weightedValue: number }> = {
      [PipelineStage.DISCOVERY]: { count: 0, totalValue: 0, weightedValue: 0 },
      [PipelineStage.QUALIFICATION]: { count: 0, totalValue: 0, weightedValue: 0 },
      [PipelineStage.PROPOSAL]: { count: 0, totalValue: 0, weightedValue: 0 },
      [PipelineStage.NEGOTIATION]: { count: 0, totalValue: 0, weightedValue: 0 },
      [PipelineStage.CLOSED_WON]: { count: 0, totalValue: 0, weightedValue: 0 },
      [PipelineStage.CLOSED_LOST]: { count: 0, totalValue: 0, weightedValue: 0 }
    };

    let totalCycleDays = 0;
    let cycleCount = 0;

    for (const deal of deals) {
      const stageInfo = byStage[deal.stage];
      if (stageInfo) {
        stageInfo.count++;
        stageInfo.totalValue += deal.amount;
        stageInfo.weightedValue += deal.weightedValue;
      }

      if (deal.stage === PipelineStage.CLOSED_WON) {
        closedWonValue += deal.amount;
        closedWonCount++;

        // Calculate sales cycle duration
        if (deal.createdAt && deal.actualCloseDate) {
          const start = new Date(deal.createdAt).getTime();
          const end = new Date(deal.actualCloseDate).getTime();
          const days = Math.max(Math.round((end - start) / (1000 * 60 * 60 * 24)), 1);
          totalCycleDays += days;
          cycleCount++;
        }
      } else if (deal.stage === PipelineStage.CLOSED_LOST) {
        closedLostValue += deal.amount;
        closedLostCount++;
      } else {
        totalPipelineValue += deal.amount;
        weightedForecastValue += deal.weightedValue;
      }
    }

    const totalClosed = closedWonCount + closedLostCount;
    const winRatePercentage = totalClosed > 0 ? (closedWonCount / totalClosed) * 100 : 0;
    const totalCount = deals.length;
    const averageDealSize = totalCount > 0 ? (totalPipelineValue + closedWonValue) / totalCount : 0;
    const averageSalesCycleDays = cycleCount > 0 ? Math.round(totalCycleDays / cycleCount) : 30;

    return {
      totalDealsCount: totalCount,
      totalPipelineValue,
      weightedForecastValue,
      closedWonValue,
      closedLostValue,
      winRatePercentage: Math.round(winRatePercentage * 100) / 100,
      averageDealSize: Math.round(averageDealSize),
      averageSalesCycleDays,
      byStage
    };
  }
}
