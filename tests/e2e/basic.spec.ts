import { test, expect } from "@playwright/test";

test("home page loads and shows game", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Play Webgrid+" })).toBeVisible();
  await expect(page.getByText(/Score/i)).not.toBeVisible();
});

test("leaderboard renders", async ({ page }) => {
  await page.goto("/leaderboard");
  await expect(page.getByRole("heading", { name: /Leaderboard/ })).toBeVisible();
});
