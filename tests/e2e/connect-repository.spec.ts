import { test, expect } from "@playwright/test";

test("repositories placeholder", async ({ page }) => {
  await page.goto("/app/workspaces/demo/repositories");
  await expect(page.getByRole("heading", { name: /repositories/i })).toBeVisible();
});
