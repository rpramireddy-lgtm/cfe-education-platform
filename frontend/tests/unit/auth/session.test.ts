import { describe, it, expect } from "vitest";
import { deriveRole, hasRole, isStaff } from "@/lib/auth/session";

describe("deriveRole", () => {
  it("returns admin when admin group present", () => {
    expect(deriveRole(["admin", "parent"])).toBe("admin");
  });

  it("returns reviewer when no admin", () => {
    expect(deriveRole(["reviewer", "parent"])).toBe("reviewer");
  });

  it("returns content_author when no admin or reviewer", () => {
    expect(deriveRole(["content_author"])).toBe("content_author");
  });

  it("returns parent when no staff groups", () => {
    expect(deriveRole(["parent"])).toBe("parent");
  });

  it("returns child when no groups match", () => {
    expect(deriveRole([])).toBe("child");
  });
});

describe("hasRole", () => {
  it("returns true when group matches", () => {
    expect(hasRole(["parent"], "parent")).toBe(true);
  });

  it("returns false when no match", () => {
    expect(hasRole(["child"], "admin")).toBe(false);
  });

  it("returns true for any matching role in list", () => {
    expect(hasRole(["reviewer"], "admin", "reviewer")).toBe(true);
  });
});

describe("isStaff", () => {
  it("returns true for admin", () => {
    expect(isStaff(["admin"])).toBe(true);
  });

  it("returns true for content_author", () => {
    expect(isStaff(["content_author"])).toBe(true);
  });

  it("returns false for parent", () => {
    expect(isStaff(["parent"])).toBe(false);
  });

  it("returns false for child", () => {
    expect(isStaff(["child"])).toBe(false);
  });
});
