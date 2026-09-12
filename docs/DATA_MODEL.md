# Data Model

> Full access patterns and GSI definitions are added in Phase 2.

## Tables

| Table | PK | SK | Purpose |
|-------|----|----|---------|
| Users | `USER#<sub>` | `PROFILE` | Cognito sub → role, parent↔child links |
| Curriculum | `LEVEL#<id>` | `SUBJECT#<id>#ORGANISER#<id>...` | CfE hierarchy |
| Content | `LESSON#<id>` | `VERSION#<n>` | Lessons, activities, questions with versioning |
| Progress | `CHILD#<id>` | `LESSON#<id>#<timestamp>` | Attempts, mastery, streaks |
| Assignments | `CHILD#<id>` | `DATE#<yyyy-mm-dd>` | Daily homework records |
| Notifications | `USER#<id>` | `NOTIF#<timestamp>#<idempotencyKey>` | In-app notifications |
| Subscriptions | `USER#<id>` | `SUB#<stripeSubId>` | Stripe entitlements |
| AuditEvents | `AUDIT#<date>` | `<timestamp>#<eventId>` | Append-only audit log |
| GenerationJobs | `JOB#<id>` | `STATUS#<status>` | RAG generation state |

## Child Data Principles
- Child profiles owned by parent Cognito sub — no separate child email
- Child PIN stored as bcrypt hash, never plaintext
- No child surname or sensitive results in WhatsApp payloads
- Child data never submitted to Bedrock prompts
