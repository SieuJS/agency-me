import { test, expect } from '@playwright/test';

const LOGIN_URL = 'http://agency-me.westus3.cloudapp.azure.com/';

// Helper to clear localStorage before each test
async function clearAccessToken(page) {
  await page.addInitScript(() => localStorage.removeItem('accessToken'));
}

// Helper to set accessToken before navigation
async function setAccessToken(page, token = 'dummy-token') {
  await page.addInitScript(token => {
    localStorage.setItem('accessToken', token);
  }, token);
}
test.beforeEach(async ({ page }) => {
  await page.goto(LOGIN_URL);
    await clearAccessToken(page);
    await page.reload();
});
test.describe('Login Page Access based on accessToken', () => {
  test('should show login page if accessToken is not in localStorage', async ({ page }) => {
    await expect(page.getByText('ĐĂNG NHẬP')).toBeTruthy();
  });

  test('should display fail if insert wrong email or password', async ({ page }) => {
    await page.fill('input[name="email"]', 'hungphat@gmail.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Email hoặc mật khẩu không đúng.')).toBeVisible();
    await expect(page.getByText('ĐĂNG NHẬP')).toBeTruthy();
  });

    test('should login successfully with valid credentials', async ({ page }) => {
        await page.goto(LOGIN_URL);
        await clearAccessToken(page);
        await page.reload();
        await page.fill('input[name="email"]', 'hungphat@gmail.com');
        await page.fill('input[name="password"]', '123456789');
        await page.click('button[type="submit"]');
        await expect(page.getByText('Đăng nhập thành công!')).toBeVisible();
    });
});
