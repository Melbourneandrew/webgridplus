import { test, expect } from "@playwright/test";

test("home page loads and shows game", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Webgrid+");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/wgp-favicon.png?v=2");
  await expect(page.getByRole("heading", { name: "Play Webgrid+" })).toBeVisible();
  await expect(page.getByText("Welcome to Webgrid+")).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Regular" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Blitz" })).toHaveCount(1);
  await expect(page.getByText(/Score/i)).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Regular" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: "Regular" }).hover();
  await expect(page.getByRole("link", { name: "Regular" })).toHaveCSS("text-decoration-line", "none");
});

test("game mode is synchronized with the URL", async ({ page }) => {
  await page.goto("/?mode=blitz");
  await expect(page.getByRole("link", { name: "Blitz" })).toHaveAttribute("aria-current", "page");

  await page.getByRole("link", { name: "Regular" }).click();
  await expect(page).toHaveURL(/\?mode=regular$/);
  await expect(page.getByRole("link", { name: "Regular" })).toHaveAttribute("aria-current", "page");

  await page.goBack();
  await expect(page.getByRole("link", { name: "Blitz" })).toHaveAttribute("aria-current", "page");
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
  await expect(page).toHaveTitle("Leaderboard | Webgrid+");
  await expect(page.getByRole("heading", { name: /Leaderboard/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Regular" })).toHaveAttribute("aria-current", "page");
});

test("account pages have descriptive titles", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveTitle("Log in | Webgrid+");

  await page.goto("/signup");
  await expect(page).toHaveTitle("Sign up | Webgrid+");
});

test("signing up logs the user in immediately and persists the session", async ({ page }) => {
  const uniqueId = Date.now();
  const email = `signup-${uniqueId}@example.com`;
  const displayName = `Signup Test ${uniqueId}`;

  await page.goto("/signup");
  await page.getByLabel("Display name").fill(displayName);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("correct-horse-battery-staple");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/game$/);
  await expect(page.getByRole("link", { name: "Profile" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Log in" })).toHaveCount(0);

  // Production Next.js prefetches links. Logout must be a POST button so an
  // idle authenticated page cannot revoke its own session.
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("link", { name: "Profile" })).toBeVisible();

  const cookies = await page.context().cookies();
  const accessCookie = cookies.find(({ name }) => name === "wgp_access");
  const refreshCookie = cookies.find(({ name }) => name === "wgp_refresh");
  expect(accessCookie).toMatchObject({ httpOnly: true, sameSite: "Lax" });
  expect(refreshCookie).toMatchObject({ httpOnly: true, sameSite: "Lax" });
  expect((accessCookie?.expires ?? 0) - Date.now() / 1000).toBeLessThanOrEqual(15 * 60);
  expect((refreshCookie?.expires ?? 0) - Date.now() / 1000).toBeGreaterThan(29 * 24 * 60 * 60);

  await page.reload();
  await expect(page.getByRole("link", { name: "Profile" })).toBeVisible();

  const gameResponse = await page.request.post("/api/games", {
    headers: { cookie: `wgp_access=${accessCookie?.value}` },
    data: { gameType: "regular", ntpm: 100, bps: 1.23 },
  });
  expect(gameResponse.status()).toBe(200);
  expect(await gameResponse.json()).toEqual(
    expect.objectContaining({ playedGameId: expect.any(Number) }),
  );

  await page.getByRole("link", { name: "Leaderboard" }).click();
  const row = page.getByRole("row").filter({ hasText: displayName });
  await expect(row).toContainText("1.23");

  await page.context().clearCookies({ name: "wgp_access" });
  await expect(page.context().cookies()).resolves.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: "wgp_refresh" })]),
  );
  await page.reload();
  await expect(page.getByRole("link", { name: "Profile" })).toBeVisible();
  await expect(page.context().cookies()).resolves.toEqual(
    expect.arrayContaining([expect.objectContaining({ name: "wgp_access", httpOnly: true })]),
  );
});
