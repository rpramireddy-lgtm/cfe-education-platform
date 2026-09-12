import { defineStorage } from "@aws-amplify/backend";

/**
 * S3 buckets — all private, accessed via signed URLs only.
 *
 * assets       – static lesson images, animations, Lottie files
 * pollyCache   – pre-generated Polly audio (mp3) keyed by text hash
 * receipts     – reserved for future use (not public)
 * ragDocuments – licensed source documents for Bedrock Knowledge Base (Phase 7)
 */
export const storage = defineStorage({
  name: "cfeAssets",
  access: (allow) => ({
    "assets/*": [
      allow.groups(["admin", "content_author", "reviewer"]).to(["read", "write", "delete"]),
      allow.groups(["parent", "child"]).to(["read"]),
    ],
    "polly-cache/*": [
      allow.groups(["admin"]).to(["read", "write", "delete"]),
      allow.groups(["parent", "child", "content_author", "reviewer"]).to(["read"]),
    ],
    "rag-documents/*": [
      allow.groups(["admin", "content_author"]).to(["read", "write", "delete"]),
    ],
  }),
});
