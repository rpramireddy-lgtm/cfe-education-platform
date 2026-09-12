/**
 * Application-wide TypeScript types.
 * AWS-generated types (schema, auth) are imported from amplify_outputs.json
 * and the generated client — these are hand-authored application types only.
 */

// ─── User roles ────────────────────────────────────────────────────────────────
export type UserRole = "parent" | "child" | "content_author" | "reviewer" | "admin";

// ─── CfE levels ────────────────────────────────────────────────────────────────
export type CfELevel = "early" | "first" | "second" | "third_fourth";

// ─── Subjects ──────────────────────────────────────────────────────────────────
export type Subject = "mathematics" | "english_literacy" | "science";

// ─── Content lifecycle ─────────────────────────────────────────────────────────
export type ContentStatus =
  | "DRAFT"
  | "GENERATED"
  | "VALIDATING"
  | "NEEDS_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "RETIRED";

// ─── Subscription plans ────────────────────────────────────────────────────────
export type SubscriptionPlan =
  | "free_trial"
  | "single_child_monthly"
  | "family_monthly"
  | "family_annual";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

// ─── Assignment statuses ───────────────────────────────────────────────────────
export type AssignmentStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PARTIAL"
  | "MISSED"
  | "RESCHEDULED"
  | "EXCUSED";

// ─── Notification types ────────────────────────────────────────────────────────
export type NotificationType =
  | "homework_available"
  | "homework_not_started"
  | "homework_partial"
  | "homework_completed"
  | "homework_missed"
  | "weekly_report"
  | "subscription_notice"
  | "account_notice";

// ─── Auth session user ─────────────────────────────────────────────────────────
export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
  groups: string[];
}
