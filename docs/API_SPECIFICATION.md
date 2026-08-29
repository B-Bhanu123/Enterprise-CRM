# Enterprise CRM Complete API & Architecture Specification

## Overview

OmniCRM is a high-performance Customer Relationship Management platform engineered for enterprise scalability, multi-tenant isolation, real-time SLA monitoring, visual sales pipeline forecasting, and automated workflow triggers.

---

## 1. Authentication & Security (RBAC Matrix)

| Role | Leads Read | Leads Write | Deals Read | Deals Forecast | Tickets SLA | User Management |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SALES_MANAGER** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **SALES_REP** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **SUPPORT_AGENT** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **MARKETING_MANAGER** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 2. Domain Data Models & API Endpoints

### 2.1 Lead Management API
- **`POST /api/v1/leads`**: Create new lead and trigger real-time scoring engine.
- **`GET /api/v1/leads`**: Paginated query with firmographic filters (`industry`, `employeeCount`, `annualRevenue`).
- **`PUT /api/v1/leads/:id`**: Update lead status and recalculate score.
- **`POST /api/v1/leads/:id/engage`**: Record interaction (Email open, link click, page view, meeting booking).

### 2.2 Sales Pipeline & Deal Velocity API
- **`POST /api/v1/deals`**: Create deal record in pipeline stage (`DISCOVERY`, `QUALIFICATION`, `PROPOSAL`, `NEGOTIATION`, `CLOSED_WON`, `CLOSED_LOST`).
- **`PUT /api/v1/deals/:id/stage`**: Transition deal stage and update account ARR.
- **`GET /api/v1/deals/forecast`**: Retrieve weighted revenue forecast and quota attainment metrics.

### 2.3 Support Desk & SLA Queue API
- **`POST /api/v1/tickets`**: File customer support ticket with priority-based SLA deadlines.
- **`POST /api/v1/tickets/:id/respond`**: Mark first response and check response SLA timer.
- **`POST /api/v1/tickets/:id/resolve`**: Mark resolution and record CSAT score.

### 2.4 Workflow Engine API
- **`POST /api/v1/workflows`**: Define event-driven trigger/action rule (`lead.created`, `lead.score_high`, `deal.won`, `sla.breached`).
- **`GET /api/v1/workflows/history`**: Retrieve execution history and audit logs.

---

## 3. Dynamic Lead Scoring Algorithm

The lead scoring engine computes a composite score (0–100) using weighted multi-factor metrics:
$$ \text{Score} = \text{FirmographicPoints} + \text{DemographicPoints} + \text{EngagementPoints} $$

1. **Firmographics (Max 35 points)**:
   - Employee Count $\ge 500$: +15 pts
   - Annual Revenue $\ge \$10M$: +15 pts
   - Industry Fit (Tech/Finance/Healthcare): +5 pts

2. **Demographic / Authority (Max 30 points)**:
   - Decision Maker Titles (CXO, VP, Director): +25 pts
   - Influencers (Manager, Lead): +15 pts
   - Direct Phone Verified: +5 pts

3. **Behavioral Engagement (Max 35 points)**:
   - Email Opens: +2 pts each (Max 8 pts)
   - Link Clicks: +3 pts each (Max 9 pts)
   - Meetings Scheduled: +10 pts each (Max 10 pts)
   - Page Views: +1 pt each (Max 8 pts)

---

## 4. Sales Forecasting Formula

$$ \text{Weighted Forecast} = \sum_{i=1}^{N} \left( \text{Amount}_i \times \text{Probability}(\text{Stage}_i) \right) $$

Where:
- $\text{Probability}(\text{DISCOVERY}) = 10\%$
- $\text{Probability}(\text{QUALIFICATION}) = 30\%$
- $\text{Probability}(\text{PROPOSAL}) = 60\%$
- $\text{Probability}(\text{NEGOTIATION}) = 85\%$
- $\text{Probability}(\text{CLOSED\_WON}) = 100\%$
- $\text{Probability}(\text{CLOSED\_LOST}) = 0\%$
