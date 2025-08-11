import { test } from '@playwright/test';
import LoginPage from './pages/login.page';
import InventoryPage from './pages/Inventory.page';
import dotenv from 'dotenv';

dotenv.config({ path: '.creds.env' });

test.describe('Login Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the login page before running tests
        await page.goto('https://www.saucedemo.com/v1/index.html');
    });

    test('should login with valid credentials', async ({ page }) => {
        const login = new LoginPage(page);
        await login.doLogin(process.env.my_user, process.env.my_password);
        await page.waitForURL('https://www.saucedemo.com/v1/inventory.html');
    });

    test('should validate inventory title for slow user', async ({ page }) => {
        const login = new LoginPage(page);
        await login.doLogin(process.env.my_performance_glitched_user, process.env.my_password);
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.validateInventoryTitleLoaded();
    });

    test('should validate invalid login', async ({ page }) => {
        const login = new LoginPage(page);
        await login.doLogin(process.env.my_invalid_username, process.env.my_invalid_password);
        await login.validateErrorMessage();
    });

});
