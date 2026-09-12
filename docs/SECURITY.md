# Security

> Legal review for UK GDPR and Children's Online Privacy is required before production launch.

## Authentication & Authorisation
- Cognito User Pool with 5 groups; group membership enforced in Lambda resolvers
- JWT in httpOnly cookies via Amplify SSR
- Middleware route protection by role prefix
- Backend never trusts role claims from the browser

## Data Protection
- All S3 buckets private; assets served via CloudFront signed URLs
- Encryption at rest (S3 SSE-S3, DynamoDB default encryption)
- Encryption in transit (HTTPS/TLS everywhere)
- No secrets in source control — SSM Parameter Store SecureString for all credentials

## Child Privacy
- Parent account owns all child profiles
- No child email address collected
- Child PIN stored as bcrypt hash
- No child PII in WhatsApp messages
- Child data not used to train external models
- Data export and deletion workflow (Phase 8)

## Stripe
- Webhook signature verified with `stripe.webhooks.constructEvent`
- Idempotent webhook handling via DynamoDB conditional writes
- No card details stored

## Content Security Headers
Set in `next.config.ts`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## IAM
- Least-privilege IAM roles per Lambda function
- Amplify Gen 2 generates scoped roles automatically
- CDK custom constructs follow least-privilege principle
