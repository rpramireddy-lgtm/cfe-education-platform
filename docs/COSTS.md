# Costs

Target: ~£35–£85/month for a small pilot (excluding Stripe transaction fees).

## Cost Drivers

| Service | Usage pattern | Estimated cost |
|---------|--------------|----------------|
| Amplify Hosting | Static + SSR, low traffic | ~£3–5/month |
| Cognito | First 50,000 MAU free | £0 pilot |
| AppSync | Per-request pricing | ~£2–5/month |
| DynamoDB | On-demand, low traffic | ~£2–5/month |
| S3 + CloudFront | Assets, Polly cache | ~£1–3/month |
| Lambda | Short-lived, event-driven | ~£1–2/month |
| Amazon Polly | Generated once, cached in S3 | ~£1–3/month |
| EventBridge Scheduler | Daily homework jobs | ~£0.50/month |
| Amazon Bedrock | Staff authoring only, quotas applied | ~£10–30/month |
| End User Messaging Social | WhatsApp missed homework + weekly report only | ~£5–15/month |
| SSM Parameter Store | SecureString parameters | ~£0.05/month |
| AWS Budgets | 2 alerts | £0.10/month |
| **Total** | | **~£25–68/month** |

## Cost Controls
- Polly audio generated once per text hash, cached in S3 — never regenerated on playback
- Bedrock invoked only from staff authoring workflow, not child-facing
- Generation quotas and token limits enforced in Lambda
- WhatsApp used only for missed homework and weekly reports — not every notification
- DynamoDB on-demand billing (no provisioned capacity waste)
- CloudWatch log retention: 7 days on all Lambda functions
- No OpenSearch cluster — S3 Vectors used instead
- AWS Budgets alerts at £50 and £100/month

## Budget Alerts
Created via CDK custom construct (Phase 1 CDK addition):
- Alert 1: £50/month — warning
- Alert 2: £100/month — action required
- Notification: email to account owner
