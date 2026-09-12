# Architecture

## Overview

Fully serverless, AWS-native architecture hosted in `eu-west-2` (London).

```
Browser / PWA (Next.js — Amplify Hosting + CloudFront)
        │
        │ HTTPS
        ▼
  AWS AppSync (GraphQL API)          ← Phase 2+
        │
   ┌────┴──────────────────────────────────┐
   │                                       │
DynamoDB (on-demand)            Lambda (TypeScript)
                                       │
              ┌────────────────────────┼──────────────────────┐
              │                        │                      │
           S3 Buckets              Amazon Polly         EventBridge
           - assets                (narration)          Scheduler
           - polly-cache           Phase 3+             Phase 4+
           - rag-documents
              │
         CloudFront (signed URLs)

Auth:    Cognito User Pool — groups: parent | child | content_author | reviewer | admin
Secrets: SSM Parameter Store SecureString (Stripe, WhatsApp, Bedrock model IDs)
Payments: Stripe → webhook → Lambda → DynamoDB entitlement  (Phase 6)
WhatsApp: EventBridge → Lambda → End User Messaging Social   (Phase 5)
RAG:      S3 → Bedrock Knowledge Base → S3 Vectors → Lambda  (Phase 7)
CDK:      Custom constructs for Bedrock KB, S3 Vectors, EventBridge Scheduler,
          End User Messaging Social, AWS Budgets alerts
```

## Resource Tagging
All resources tagged:
- `Application`: cfe-education-platform
- `Environment`: local | dev | prod
- `Owner`: rpramireddy-lgtm

## Log Retention
All Lambda CloudWatch log groups: **7 days**. No paid custom dashboards.
