import { test, expect } from '@playwright/test';
import LoginPage from './pages/login.page';
import InventoryPage from './pages/Inventory.page';
import CartPage from './pages/Cart.page';
import dotenv from 'dotenv';

dotenv.config({ path: '.creds.env' });

test.describe('Order Tests', () => {
    let loginPage, inventoryPage, cartPage;

    test.beforeEach(async ({ page }) => {
        // Initialize page objects
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        await page.goto('https://www.saucedemo.com/v1/index.html');
        await loginPage.doLogin(process.env.my_user, process.env.my_password);
    });

    test('should validate cart count after adding an item', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.navigateToCart();
        await cartPage.validateCartPageLoaded();
        await cartPage.validateCartItemCount(1);
        await cartPage.validateItemInCart('Sauce Labs Backpack');
    });

    test('should place an order successfully', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.navigateToCart();
        await cartPage.validateCartPageLoaded();
        await cartPage.validateItemInCart('Sauce Labs Backpack');
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one.html/);
    });

    test('should add multiple items and validate cart', async ({ page }) => {
        const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
        for (const item of items) {
            await inventoryPage.addProductByName(item);
        }
        await cartPage.navigateToCart();
        await cartPage.validateCartPageLoaded();
        await cartPage.validateCartItemCount(items.length);
        for (const item of items) {
            await cartPage.validateItemInCart(item);
        }
    });

    test('should remove item from cart', async ({ page }) => {
        const itemName = 'Sauce Labs Backpack';
        await inventoryPage.addProductByName(itemName);
        await cartPage.navigateToCart();
        await cartPage.validateItemInCart(itemName);
        await cartPage.removeItemFromCart(itemName);
        await cartPage.validateCartIsEmpty();
    });

});
