import { test, expect } from "@playwright/test";

test("home page loads and shows game", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Play Webgrid+" })).toBeVisible();
  await expect(page.getByText("Welcome to Webgrid+")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Regular" })).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Blitz" })).toHaveCount(1);
  await expect(page.getByText(/Score/i)).not.toBeVisible();
});

test("misclick flashes only the clicked cell red", async ({ page }) => {
  await page.goto("/");
  const grid = page.getByLabel("Game grid");
  const misclickedCell = grid.getByRole("button").first();
  const otherCell = grid.getByRole("button").nth(1);

  await misclickedCell.click();
  await expect(misclickedCell).toHaveClass(/bg-red-600/);
  await expect(otherCell).not.toHaveClass(/bg-red-600/);
  await expect(grid).not.toHaveClass(/bg-red-600/);
  await expect(misclickedCell).not.toHaveClass(/bg-red-600/, { timeout: 1000 });
});

test("uses a compact 12 by 12 grid on small displays", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 800 });
  await page.goto("/");
  const grid = page.getByLabel("Game grid");
  await expect(grid).toHaveAttribute("data-grid-size", "12");
  await expect(grid.getByRole("button")).toHaveCount(144);
});

test("uses a 30 by 30 grid and dark hover feedback on large displays", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const grid = page.getByLabel("Game grid");
  await expect(grid).toHaveAttribute("data-grid-size", "30");
  await expect(grid.getByRole("button")).toHaveCount(900);
  await expect(grid.getByRole("button").first()).toHaveClass(/hover:bg-black\/20/);
});

test("leaderboard renders", async ({ page }) => {
  await page.goto("/leaderboard");
  await expect(page.getByRole("heading", { name: /Leaderboard/ })).toBeVisible();
});
