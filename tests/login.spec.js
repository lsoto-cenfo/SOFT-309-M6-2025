import { test } from '@playwright/test';
import LoginPage from '../tests/pages/login.page.js';
import InventoryPage from '../tests/pages/Inventory.page.js';

test.describe('Login Tests', () => {

     test.beforeEach(async ({page}) => {
        await page.goto('https://www.saucedemo.com/v1/index.html');
    });

    test('should login with valid credentials', async ({page}) => {
        const login = new LoginPage(page);
        await login.doLogin(process.env.my_user, process.env.my_password);
        
        // Verify successful login
        await page.waitForURL('https://www.saucedemo.com/v1/inventory.html');
    });

    test('should validate inventory title for slow user', async ({ page }) => {
        const login = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        // Use performance glitch user for this test        
        await login.doLogin(process.env.myperformance_user, process.env.my_password);
        await inventoryPage.validateInventoryTitleLoaded();
    });

    test('should validate login with invalid credentials', async ({ page }) => {
        const login = new LoginPage(page);
        await login.doLogin(process.env.myinvalid_user, process.env.myinvalid_password);
        // Verify unsuccessful login
        await page.waitForURL('https://www.saucedemo.com/v1/index.html');
        await login.validateLoginFailed();

    });

});