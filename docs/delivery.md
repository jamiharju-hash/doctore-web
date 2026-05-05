# Delivery Plan: Phase 2

This document outlines the high-level delivery plan, feature flag strategy, and deployment patterns for Phase 2 of Doctore AI platform.

## Phase Strategy

Based on the core objective of maximizing the value of the platform, the rollout is structured into three critical phases. Building the social layer before optimizing the live-edge loop would be a mis-prioritization.

### Phase 2A: The Money-Maker
Focuses on the core loop of finding edges and acting on them quickly.

- **Live Odds:** Real-time integration and updates of odds.
- **Repricing:** Rapid recalculation of edges based on live odds movements.
- **Notification Engine:** Alerting users to high-value edges immediately.

### Phase 2B: The Scale Layer
Focuses on expanding the market catalog and supporting multiple sports.

- **Multi-Sport Adapters:** Abstracting odds ingestion for new sports (e.g., NBA, NFL).
- **Sport-Aware Schemas:** Extending the data models to handle sport-specific rules and markets.
- **Broader Catalog:** Ingesting a wider array of betting markets.

### Phase 2C: The Retention Garnish
Focuses on user retention, gamification, and social proof.

- **Leaderboard:** Aggregating and ranking user performance based on tracked bets.
- **Public Profile:** Opt-in public surfaces for users to showcase verified edges.
- **Shareability:** Tools for users to share their successes externally.

## Deployment & Delivery Patterns

Phase 2 introduces more complexity into the deployment lifecycle, requiring robust rollout controls.

### 1. Cron Ingestion Pipelines
- Scheduled jobs (`cron`) will handle routine baseline odds fetching.
- WebSocket / streaming approaches may be scoped for "live odds" updates in specific high-priority markets.

### 2. Feature Flags
To decouple deployment from release, all major features will be gated behind feature flags (stored per-user in `featureFlags/{uid}`).

- `liveOddsEnabled`: Controls access to the real-time pricing feeds.
- `notificationsEnabled`: Controls access to the notification settings and delivery engine.
- `multiSportEnabled`: Controls the UI switcher and filters for new sports.
- Phase rollouts begin with **internal staff only**, then expand to **beta users**. General production release only occurs after operational stability and metric validation.

### 3. Deploy Paths
- **Frontend (Vercel/Web):** Immutable deployments. Rollbacks are performed by reverting to a previous successful deployment.
- **Backend/Workers (Cloud Run / Functions):** Ingestion workers and ML model APIs will utilize traffic splitting for gradual rollouts and safe testing of new models.
