# Deployment

## Environments

| Environment | Branch | AWS Account | Amplify App |
|-------------|--------|-------------|-------------|
| local | — | 471112846238 | sandbox (personal) |
| dev | develop | 471112846238 | cfe-education-dev |
| prod | main | 471112846238 | cfe-education-prod |

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local — set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# 3. Start Amplify sandbox (deploys real Cognito + S3 to AWS)
cd amplify
npx ampx sandbox
# This generates amplify_outputs.json in the project root

# 4. Start Next.js (separate terminal)
cd frontend
npm run dev
```

## Amplify Hosting Setup (first time)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/backend-cli

# Connect GitHub repo to Amplify Hosting via AWS Console:
# AWS Console → Amplify → New App → Host web app → GitHub
# Repo: rpramireddy-lgtm/cfe-education-platform
# Branch: main (prod), develop (dev)
# Build settings: auto-detected from amplify.yml (added Phase 8)
```

## SSM Parameters (set before first deploy)

```bash
# Stripe
aws ssm put-parameter --name /cfe-education/prod/stripe/secret-key \
  --value "sk_live_..." --type SecureString --region eu-west-2

aws ssm put-parameter --name /cfe-education/prod/stripe/webhook-secret \
  --value "whsec_..." --type SecureString --region eu-west-2

# Polly voice (default: Amy)
aws ssm put-parameter --name /cfe-education/prod/polly/voice-id \
  --value "Amy" --type String --region eu-west-2

# Bedrock models
aws ssm put-parameter --name /cfe-education/prod/bedrock/generation-model-id \
  --value "anthropic.claude-3-5-haiku-20241022-v1:0" --type String --region eu-west-2

aws ssm put-parameter --name /cfe-education/prod/bedrock/embedding-model-id \
  --value "amazon.titan-embed-text-v2:0" --type String --region eu-west-2
```

## CDK Custom Constructs (Phase 5–7)

```bash
cd amplify/custom
npm install
npx cdk deploy --all --context env=prod
```
