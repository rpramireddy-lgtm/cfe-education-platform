# RAG Pipeline

> Implemented in Phase 7.

## Flow

```
Licensed source documents
        │
        ▼
   S3 (rag-documents bucket)
        │
        ▼
Bedrock Knowledge Base ingestion job
        │
        ▼
   S3 Vectors (embeddings store)
        │
        ▼
Staff submits generation request (level, subject, outcome, question types, count)
        │
        ▼
Lambda: metadata-filtered retrieval from Knowledge Base
        │
        ▼
Lambda: Bedrock generation with strict JSON schema prompt
        │
        ▼
Lambda: Zod schema validation + deterministic maths validation
        │
        ▼
Lambda: duplicate detection via embedding similarity
        │
        ▼
DynamoDB GenerationJob record → status: NEEDS_REVIEW
        │
        ▼
Reviewer approves / rejects in staff UI
        │
        ▼
status: APPROVED → PUBLISHED (visible to children)
```

## Safety Rules
- Children never invoke Bedrock directly
- No child PII in prompts
- Every generated question must cite a source chunk
- Maths answers recalculated programmatically — never trusted from model output
- Unlicensed sources never ingested
- All generation jobs logged with model ID, prompt version, timestamp
