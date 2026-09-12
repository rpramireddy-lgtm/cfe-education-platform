import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { storage } from "./storage/resource";

/**
 * CFE Education Platform — Amplify Gen 2 backend root.
 *
 * Phase 1: auth + storage only.
 * data (AppSync/DynamoDB) is added in Phase 2.
 * Lambda functions are added from Phase 3 onwards.
 * CDK custom constructs (Bedrock KB, EventBridge Scheduler,
 * End User Messaging Social) are added in Phase 5–7.
 */
const backend = defineBackend({
  auth,
  storage,
});

// Tag all resources for cost allocation
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.addPropertyOverride("UserPoolTags", {
  Application: "cfe-education-platform",
  Environment: process.env.AMPLIFY_ENV ?? "local",
  Owner: "rpramireddy-lgtm",
});

export default backend;
