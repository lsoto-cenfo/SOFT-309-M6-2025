import { test } from '@playwright/test';
import LoginPage from '../tests/pages/Login.page.js';
import InventoryPage from '../tests/pages/Inventory.page.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

test.describe('Login Tests', () => {
    let login, inventoryPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/v1/index.html');
        login = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
    });

    test('should login with valid credentials', async ({ page }) => {
        await login.doLogin(process.env.my_user, process.env.my_password);
        await page.waitForURL('https://www.saucedemo.com/v1/inventory.html');
    });

    test('should validate inventory title for slow user', async ({ page }) => {
        await login.doLogin(process.env.my_performance_glitched_user, process.env.my_password);
        await inventoryPage.validateInventoryTitleLoaded();
    });
});