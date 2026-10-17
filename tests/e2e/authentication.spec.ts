import { test, expect } from "@playwright/test";

test("sign-in renders", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
});
