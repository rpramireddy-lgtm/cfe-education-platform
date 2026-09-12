# CfE Education Platform

Interactive, subscription-based learning platform for Scottish Curriculum for Excellence (CfE) First Level children.

## Subjects
- Mathematics (Phase 1–3)
- English & Literacy (Phase 2+)
- Science (Phase 2+)

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript strict, Tailwind CSS, PWA
- **Backend**: AWS Amplify Gen 2, AppSync GraphQL, DynamoDB, Lambda (TypeScript)
- **Auth**: Amazon Cognito (5 roles: parent, child, content_author, reviewer, admin)
- **Storage**: Amazon S3 (private, signed URLs)
- **Notifications**: EventBridge Scheduler, AWS End User Messaging Social (WhatsApp)
- **AI**: Amazon Bedrock, Bedrock Knowledge Bases, S3 Vectors
- **Payments**: Stripe Checkout, Billing Portal, Webhooks
- **Region**: eu-west-2 (London)

## Local Development

### Prerequisites
- Node.js 20 LTS
- AWS CLI configured with account `471112846238` (eu-west-2)
- Amplify Gen 2 CLI: `npm install -g @aws-amplify/backend-cli`

### Setup

```bash
git clone https://github.com/rpramireddy-lgtm/cfe-education-platform.git
cd cfe-education-platform

# Install all workspace dependencies
npm install

# Copy env example
cp frontend/.env.example frontend/.env.local

# Start Amplify sandbox (deploys auth + storage to your AWS account)
cd amplify && npx ampx sandbox

# In a separate terminal, start Next.js
cd frontend && npm run dev
```

Frontend: http://localhost:3000

### Environment Variables
See `.env.example` at the root and `frontend/.env.example` for all required variables.
All secrets (Stripe, WhatsApp, Bedrock model IDs) are stored in SSM Parameter Store — never in `.env` files committed to source control.

## Deployment
See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Architecture
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Data Model
See [docs/DATA_MODEL.md](docs/DATA_MODEL.md).

## Costs
See [docs/COSTS.md](docs/COSTS.md). Target: ~£35–£85/month for pilot.

## Implementation Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Repo, Next.js, Amplify Auth, Design system, CI | ✅ Complete |
| 2 | Curriculum data model, Admin UI, Content lifecycle | 🔜 Next |
| 3 | Lesson renderer, Activity types, Validation, Polly | ⏳ Pending |
| 4 | Homework engine, Mastery, Parent dashboard, Push | ⏳ Pending |
| 5 | WhatsApp, Consent, Templates, Scheduler | ⏳ Pending |
| 6 | Stripe Checkout, Portal, Webhooks, Entitlements | ⏳ Pending |
| 7 | Bedrock KB, S3 Vectors, RAG generator, Review | ⏳ Pending |
| 8 | Accessibility, Security review, E2E, Prod deploy | ⏳ Pending |
