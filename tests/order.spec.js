import { test, expect } from '@playwright/test';
import LoginPage from './pages/Login.page.js';
import InventoryPage from './pages/Inventory.page.js';
import CartPage from './pages/Cart.page.js';
import Checkout1Page from './pages/Checkout1.page.js';
import Checkout2Page from './pages/Checkout2.page.js';
import FinishPage from './pages/Finish.page.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.creds.env' });

test.describe('Order Tests', () => {
    let loginPage, inventoryPage, cartPage, checkout1Page, checkout2Page, finishPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkout1Page = new Checkout1Page(page);
        checkout2Page = new Checkout2Page(page);
        finishPage = new FinishPage(page);
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
        const testItem = 'Sauce Labs Backpack';
        const customerInfo = {
            firstName: process.env.first_name,
            lastName: process.env.last_name,
            postalCode: process.env.postal_code
        };
        await inventoryPage.addProductByName(testItem);
        await cartPage.navigateToCart();
        await cartPage.validateCartPageLoaded();
        await cartPage.validateItemInCart(testItem);
        await cartPage.validateCartItemCount(1);
        await cartPage.proceedToCheckout();
        await checkout1Page.validateCheckoutStep1PageLoaded();
        await checkout1Page.fillCustomerInformation(
            customerInfo.firstName,
            customerInfo.lastName,
            customerInfo.postalCode
        );
        await checkout1Page.continueToStep2();
        await checkout2Page.validateCheckoutStep2PageLoaded();
        await checkout2Page.validateItemInSummary(testItem);
        await checkout2Page.validateItemsCount(1);
        await checkout2Page.finishOrder();
        await finishPage.validateOrderComplete();
        await finishPage.validateThankYouMessage();
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

    test('should cancel order from checkout step 1', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.navigateToCart();
        await cartPage.proceedToCheckout();
        await checkout1Page.validateCheckoutStep1PageLoaded();
        await checkout1Page.cancelCheckout();
        await cartPage.validateCartPageLoaded();
        await cartPage.validateItemInCart('Sauce Labs Backpack');
    });

    test('should complete checkout flow with multiple items', async ({ page }) => {
        const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
        const customerInfo = {
            firstName: process.env.first_name,
            lastName: process.env.last_name,
            postalCode: process.env.postal_code
        };
        for (const item of items) {
            await inventoryPage.addProductByName(item);
        }
        await cartPage.navigateToCart();
        await cartPage.validateCartItemCount(items.length);
        await cartPage.proceedToCheckout();
        await checkout1Page.fillCustomerInformation(
            customerInfo.firstName,
            customerInfo.lastName,
            customerInfo.postalCode
        );
        await checkout1Page.continueToStep2();
        await checkout2Page.validateCheckoutStep2PageLoaded();
        for (const item of items) {
            await checkout2Page.validateItemInSummary(item);
        }
        await checkout2Page.finishOrder();
        await finishPage.validateOrderComplete();
    });

});
