import { test } from '@playwright/test';
import LoginPage from './pages/login.page.js';
import InventoryPage from './pages/Inventory.page.js';
import user from '../data/user.json';


test.describe('Inventory Tests', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('https://www.saucedemo.com/v1/index.html');
        const login = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        await login.doLogin(process.env.my_user, process.env.my_password);

          // Verify successful login
        await page.waitForURL('https://www.saucedemo.com/v1/inventory.html');
        await inventoryPage.validateInventoryTitleLoaded();
    });

    test('should add item to cart', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart('Sauce Labs Backpack');         
    });     

    test('should remove item from cart', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart('Sauce Labs Backpack'); // Add item first
        await inventoryPage.removeItemFromCart('Sauce Labs Backpack'); // Then remove it
    });


    test('should complete order with item', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.completeOrderWithItem('Sauce Labs Backpack', user);
    });

    test('should cancel order', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.cancelOrder('Sauce Labs Backpack', user); // Add item and cancel order with user data
    });

    test('should validate correct purchase total', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.validateTotalPrice('Sauce Labs Backpack', user); // Validate total price after adding item
    });


    test('should navigate to inventory page and check item details', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.checkInventoryItemNames('Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Onesie');
    });
    


});