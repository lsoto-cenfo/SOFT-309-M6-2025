import { expect, test } from '@playwright/test';
import LoginPage from './pages/Login.page.js';
import InventoryPage from './pages/Inventory.page.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.creds.env' });

test.describe('Inventory Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the login page before running tests
        await page.goto('https://www.saucedemo.com/v1/index.html');
    });

    test('should add single item (Sauce Labs Backpack) to cart', async ({ page }) => {
        const login = new LoginPage(page);
        await login.doLogin(process.env.my_user, process.env.my_password);
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addProductByName('Sauce Labs Backpack');
    });

    test('should add multiple items (all items) to cart', async ({ page }) => {
        const login = new LoginPage(page);
        await login.doLogin(process.env.my_user, process.env.my_password);
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addAllItemsToCart();
    });

    test('should validate adding an item and removing it from cart', async ({ page }) => {
        const login = new LoginPage(page);
        await login.doLogin(process.env.my_user, process.env.my_password);
        const inventoryPage = new InventoryPage(page);
        
    
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await expect(inventoryPage.page.locator('.shopping_cart_badge')).toHaveText('1');
        await inventoryPage.removeProductByName('Sauce Labs Backpack');
        await expect(inventoryPage.page.locator('.shopping_cart_badge')).not.toBeVisible();
    });
});
