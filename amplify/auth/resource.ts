import { defineAuth } from "@aws-amplify/backend";

/**
 * Cognito User Pool with five application groups.
 *
 * Groups and their intended permissions:
 *   parent         – manages child profiles, subscriptions, progress
 *   child          – accesses lessons and homework (subordinate profile)
 *   content_author – creates and submits curriculum content
 *   reviewer       – approves or rejects content submissions
 *   admin          – full platform management
 *
 * Group membership is enforced in Lambda resolvers and AppSync auth rules.
 * Never rely solely on frontend role checks.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["parent", "child", "content_author", "reviewer", "admin"],
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false,
  },
  accountRecovery: "EMAIL_ONLY",
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false,
    },
    "custom:role": {
      dataType: "String",
      mutable: true,
    },
    "custom:parentId": {
      dataType: "String",
      mutable: true,
    },
  },
});
