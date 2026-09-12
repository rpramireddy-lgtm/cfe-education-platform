import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import type { AuthUser, UserRole } from "@/types";

/**
 * Returns the current authenticated user with their role derived from
 * Cognito group membership. Throws if unauthenticated.
 */
export async function getCurrentUser(): Promise<AuthUser> {
  const [session, attributes] = await Promise.all([
    fetchAuthSession(),
    fetchUserAttributes(),
  ]);

  const groups =
    (session.tokens?.accessToken.payload["cognito:groups"] as string[]) ?? [];

  const role = deriveRole(groups);

  return {
    userId: attributes.sub ?? "",
    email: attributes.email ?? "",
    role,
    groups,
  };
}

/**
 * Derives the highest-privilege role from Cognito group membership.
 * Order: admin > reviewer > content_author > parent > child
 */
export function deriveRole(groups: string[]): UserRole {
  if (groups.includes("admin")) return "admin";
  if (groups.includes("reviewer")) return "reviewer";
  if (groups.includes("content_author")) return "content_author";
  if (groups.includes("parent")) return "parent";
  return "child";
}

export function hasRole(groups: string[], ...roles: UserRole[]): boolean {
  return roles.some((r) => groups.includes(r));
}

export function isStaff(groups: string[]): boolean {
  return hasRole(groups, "admin", "reviewer", "content_author");
}
