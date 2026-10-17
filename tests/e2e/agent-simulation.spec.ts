import { test, expect } from "@playwright/test";

test("agent workspace starts a session", async ({ page }) => {
  await page.goto("/app/workspaces/demo/agent");
  await page.getByRole("button", { name: /start session/i }).click();
  await expect(page.getByPlaceholder(/ask the agent/i)).toBeVisible();
});
