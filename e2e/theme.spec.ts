import { test, expect } from '@playwright/test';

test.describe('Theme detection', () => {

  test('uses light theme if browser prefers light and no theme cookie set', async ({ page }) => {
    await page.context().setExtraHTTPHeaders({
      'sec-ch-prefers-color-scheme': 'light',
    });

    await page.goto('/');

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('forces dark theme if theme cookie is dark', async ({ page }) => {
    await page.context().addCookies([
      {
        name: 'theme',
        value: 'dark',
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('forces light theme if theme cookie is light', async ({ page }) => {
    await page.context().addCookies([
      {
        name: 'theme',
        value: 'light',
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    await page.goto('/');

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
  });
});
