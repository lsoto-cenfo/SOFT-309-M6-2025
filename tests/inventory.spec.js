import { expect, test } from '@playwright/test';
import LoginPage from './pages/login.page';
import InventoryPage from './pages/Inventory.page';
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
        await inventoryPage.addSauceLabsBackpackToCart();
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
        
        // Add item to cart
        await inventoryPage.addSauceLabsBackpackToCart();
        
        // Verify cart badge shows 1 item
        await expect(inventoryPage.page.locator('.shopping_cart_badge')).toHaveText('1');
        
        // Remove item from cart
        await inventoryPage.removeSauceLabsBackpackFromCart();
        
        // Verify cart badge is no longer visible (no items in cart)
        await expect(inventoryPage.page.locator('.shopping_cart_badge')).not.toBeVisible();
    });
});
