import { test, expect } from "@playwright/test";

test("home page loads and shows sign in link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "CfE Learning" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Create account" })).toBeVisible();
});

test("navigates to login page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page).toHaveURL("/login");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("navigates to register page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Create account" }).click();
  await expect(page).toHaveURL("/register");
  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
});

test("login form shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
});

test("health check endpoint returns ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  const body = await response.json() as { status: string };
  expect(body.status).toBe("ok");
});
