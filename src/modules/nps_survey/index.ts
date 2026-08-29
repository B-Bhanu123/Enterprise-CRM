/**
 * CSAT & Net Promoter Score (NPS) Survey Engine
 */

export interface NPSSurveyResponse {
  responseId: string;
  contactId: string;
  score: number; // 0 - 10
  feedbackText?: string;
}

export class NPSSurveyEngine {
  private responses: NPSSurveyResponse[] = [];

  public submitResponse(resp: NPSSurveyResponse): void {
    if (resp.score < 0 || resp.score > 10) throw new Error('Invalid NPS score');
    this.responses.push(resp);
  }

  public calculateNPS(): number {
    if (this.responses.length === 0) return 0;

    let promoters = 0;
    let detractors = 0;

    for (const r of this.responses) {
      if (r.score >= 9) promoters++;
      else if (r.score <= 6) detractors++;
    }

    const total = this.responses.length;
    const nps = Math.round(((promoters - detractors) / total) * 100);
    return nps;
  }
}
