# Content Schema

> Full JSON schema definitions are added in Phase 2.

## Lesson JSON Structure (outline)

```json
{
  "id": "lesson_<uuid>",
  "version": 1,
  "status": "DRAFT | GENERATED | VALIDATING | NEEDS_REVIEW | APPROVED | PUBLISHED | RETIRED",
  "cfeLevel": "first",
  "subject": "mathematics",
  "organiser": "number-money-measure",
  "outcomeCode": "MNU 1-02a",
  "benchmarks": ["..."],
  "title": "Adding numbers to 20",
  "learningObjectives": ["..."],
  "prerequisiteSkills": ["..."],
  "estimatedDurationMinutes": 20,
  "difficulty": "developing | secure | extending",
  "author": "<userId>",
  "reviewer": "<userId>",
  "activities": [
    {
      "type": "teacher_explanation | single_choice | number_input | drag_drop | ...",
      "config": { "...": "type-specific config" },
      "validation": { "strategy": "exact_number | accepted_values | ...", "answer": "..." },
      "hints": ["hint 1", "hint 2"],
      "feedback": { "correct": "...", "incorrect": "..." }
    }
  ],
  "masteryCheck": { "passMark": 80, "questions": [] },
  "sourceReferences": [{ "sourceId": "...", "licence": "CC-BY-4.0" }],
  "isDemoContent": true
}
```

## Activity Types (Phase 3)
1. teacher_explanation
2. image_animation
3. audio_narration
4. single_choice
5. multiple_choice
6. number_input
7. short_text
8. matching_pairs
9. ordering
10. drag_drop
11. category_sort
12. ten_frame
13. number_line
14. sentence_builder
15. mastery_check
