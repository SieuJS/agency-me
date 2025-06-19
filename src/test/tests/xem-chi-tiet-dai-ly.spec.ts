import {test, expect} from '@playwright/test';

const LOGIN_URL = 'http://agency-me.westus3.cloudapp.azure.com/';

async function Login(page, email, password) {
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
}

async function clearAccessToken(page) {
  await page.addInitScript(() => localStorage.removeItem('accessToken'));
}


test.beforeEach(async ({page}) => {
    await page.goto(LOGIN_URL);
    await clearAccessToken(page);
    await page.reload();
    await Login(page, 'hungphat@gmail.com', '123456789');
});

test.describe('Agency Lookup Page', () => {
    test('should display agency details when found', async ({page}) => {
        await page.fill('input#searchName', 'Alpha');
        await page.getByRole('button', { name: /Tìm/ }).click();
        await expect(page.getByText('Đại lý alpha')).toBeVisible();
        await page.getByRole('link', { name: /Đại Lý Alpha/ }).click();
        await expect(page.getByText('Chi tiết đại lý')).toBeVisible();
        await expect(page.getByText('Đại lý Alpha')).toBeVisible();
    });
});