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

        // Navigate to login page and authenticate
        await page.goto('https://www.saucedemo.com/v1/index.html');
        await loginPage.doLogin(process.env.my_user, process.env.my_password);
    });

    test('should validate cart count after adding an item', async ({ page }) => {
        // Add item and navigate to cart
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.navigateToCart();
        
        // Validate cart state
        await cartPage.validateCartPageLoaded();
        await cartPage.validateCartItemCount(1);
        await cartPage.validateItemInCart('Sauce Labs Backpack');
    });

    test('should place an order successfully', async ({ page }) => {
        // Add item and proceed through order flow
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.navigateToCart();
        await cartPage.validateCartPageLoaded();
        await cartPage.validateItemInCart('Sauce Labs Backpack');
        
        // Proceed to checkout and verify navigation
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one.html/);
    });

    test('should add multiple items and validate cart', async ({ page }) => {
        const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
        
        // Add multiple items
        for (const item of items) {
            await inventoryPage.addProductByName(item);
        }
        
        // Navigate to cart and validate all items
        await cartPage.navigateToCart();
        await cartPage.validateCartPageLoaded();
        await cartPage.validateCartItemCount(items.length);
        
        // Validate each item is present
        for (const item of items) {
            await cartPage.validateItemInCart(item);
        }
    });

    test('should remove item from cart', async ({ page }) => {
        const itemName = 'Sauce Labs Backpack';
        
        // Add item and navigate to cart
        await inventoryPage.addProductByName(itemName);
        await cartPage.navigateToCart();
        await cartPage.validateItemInCart(itemName);
        
        // Remove item and validate empty cart
        await cartPage.removeItemFromCart(itemName);
        await cartPage.validateCartIsEmpty();
    });

    test('should add all items and remove them individually', async ({ page }) => {
        const items = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt'
        ];
        
        // Add multiple items
        for (const item of items) {
            await inventoryPage.addProductByName(item);
        }
        
        await cartPage.navigateToCart();
        await cartPage.validateCartItemCount(items.length);
        
        // Remove items one by one and validate count decreases
        for (let i = items.length - 1; i >= 0; i--) {
            await cartPage.removeItemFromCart(items[i]);
            await cartPage.validateCartItemCount(i);
        }
        
        // Final validation - cart should be empty
        await cartPage.validateCartIsEmpty();
    });

});
