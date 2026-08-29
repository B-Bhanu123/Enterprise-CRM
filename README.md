# Enterprise CRM System (OmniCRM)

An enterprise-grade Customer Relationship Management (CRM) platform built with a modular full-stack TypeScript/Node.js architecture. Features include multi-tenant isolation, real-time SLA monitoring, visual sales pipeline forecasting, event-driven workflow automation, interactive glassmorphic UI, and comprehensive automated test suites.

---

## Table of Contents

- [Overview & Key Features](#overview--key-features)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Build Instructions](#build-instructions)
- [Running the Application](#running-the-application)
- [Automated Testing](#automated-testing)
- [Dependencies](#dependencies)
- [API Documentation](#api-documentation)
- [License](#license)

---

## Overview & Key Features

- **Lead Intelligence & Scoring**: Dynamic multi-factor lead scoring algorithm based on firmographics, demographic authority, and behavioral metrics.
- **Sales Pipeline Kanban & Forecasting**: Visual stage progression across weighted deal probabilities, revenue forecasting, and quota attainment tracking.
- **Support Desk & SLA Monitoring**: Priority-based response SLA clocks (`URGENT`: 1h, `HIGH`: 4h, `MEDIUM`: 12h, `LOW`: 24h) with automated breach alerts and CSAT tracking.
- **Event-Driven Workflow Automation**: Dynamic rule evaluator engine supporting AST condition parsing and automated task/notification actions.
- **Executive Analytics Dashboard**: Interactive real-time metrics, revenue trend charts, and sales funnel breakdown.
- **Role-Based Access Control (RBAC)**: Granular permission matrix for `ADMIN`, `SALES_MANAGER`, `SALES_REP`, `SUPPORT_AGENT`, `MARKETING_MANAGER`, and `VIEWER`.

---

## System Architecture

```text
├── src/
│   ├── core/                  # Base infrastructure (Logger, Database, EventBus, Errors)
│   ├── modules/               # Domain feature modules
│   │   ├── auth/              # Authentication & RBAC Middleware
│   │   ├── leads/             # Lead scoring & assignment engines
│   │   ├── contacts/          # Contact 360 & Account hierarchy
│   │   ├── deals/             # Sales pipeline & forecasting
│   │   ├── activities/        # Tasks, meetings, and calendar sync
│   │   ├── tickets/           # Support queue & SLA monitoring
│   │   ├── campaigns/         # Email drip campaigns & audience segments
│   │   ├── workflows/         # Event-driven rule evaluator
│   │   ├── analytics/         # Reporting & funnel calculation engine
│   │   └── ...                # Extended enterprise domain services
│   ├── client/                # Modern UI CSS design system & React components
│   └── server.ts              # Express API server entry point
├── tests/                     # Automated unit and integration test suites
├── scripts/                   # Test runner, LOC audit, and server scripts
├── docs/                      # API and Schema specifications
└── package.json               # Manifest & dependency definitions
```

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**: `v2.30.0` or higher

---

## Installation

Clone the repository and install dependencies using `npm`:

```bash
git clone https://github.com/B-Bhanu123/Enterprise-CRM.git
cd Enterprise-CRM
npm install
```

---

## Build Instructions

To compile TypeScript source files to the production distribution folder (`dist/`):

```bash
npm run build
```

---

## Running the Application

### Development Mode
Start the live development server with local dashboard and API endpoints:

```bash
npm run dev
```

The application will be accessible at:
👉 **[http://localhost:3000](http://localhost:3000)**

### Production Mode
Build the project and launch the production server:

```bash
npm run build
npm start
```

---

## Automated Testing

Run the automated test suite covering lead scoring, RBAC permissions, pipeline forecasting, workflow engine, CSV import validation, and SLA monitoring:

```bash
npm test
```

To run the Lines of Code (LOC) audit script:

```bash
npm run count-loc
```

---

## Dependencies

### Core Production Dependencies
- `express` (`^4.19.2`): Core HTTP web server framework.
- `cors` (`^2.8.5`): Cross-Origin Resource Sharing middleware.
- `dotenv` (`^16.4.5`): Environment configuration loader.
- `zod` (`^3.23.8`): Schema validation library.
- `jsonwebtoken` (`^9.0.2`): Authentication token manager.
- `bcryptjs` (`^2.4.3`): Password hashing utility.
- `uuid` (`^9.0.1`): Unique identifier generator.

### Development Dependencies
- `typescript` (`^5.4.5`): TypeScript compiler.
- `ts-node` (`^10.9.2`): TypeScript execution engine.
- `jest` (`^29.7.0`): Testing framework.

---

## API Documentation

| Endpoint | Method | Permission Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/v1/health` | `GET` | Public | System status and health metrics |
| `/api/v1/auth/login` | `POST` | Public | Authenticate user & issue session token |
| `/api/v1/leads` | `GET` | `leads:read` | Query paginated lead records |
| `/api/v1/leads` | `POST` | `leads:create` | Create lead and calculate score |
| `/api/v1/deals` | `GET` | `deals:read` | Retrieve sales pipeline deals |
| `/api/v1/deals/forecast` | `GET` | `deals:forecast` | Get weighted revenue forecast |
| `/api/v1/tickets` | `GET` | `tickets:read` | List support queue & SLA status |
| `/api/v1/analytics/summary` | `GET` | `analytics:view` | Executive performance dashboard metrics |

---

## License

Proprietary Software - All Rights Reserved. (UNLICENSED)
