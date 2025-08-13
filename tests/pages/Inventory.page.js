import { Page, expect } from '@playwright/test';

class InventoryPage {
    /** @type {Page} */
    page;

    /**
     * @param {Page} page
     */
    constructor(page){
        this.page = page;
        this.inventoryTitle = this.page.locator('div[class="product_label"]');
    }

    validateInventoryTitleLoaded = async () => {
        await this.inventoryTitle.waitFor({ state: 'visible' });
        await expect(this.inventoryTitle).toBeVisible();
    }

    addProductByName = async (productName) => {
        await this.page.waitForSelector('.inventory_item');
        const addItemButton = this.page.locator('.inventory_item').filter({ hasText: productName }).locator('button');
        await addItemButton.click();
    } 

    removeProductByName = async (productName) => {
        await this.page.waitForSelector('.inventory_item');
        const removeItemButton = this.page.locator('.inventory_item').filter({ hasText: productName }).locator('button');
        await removeItemButton.click();
    }

    addAllItemsToCart = async () => {
        await this.addProductByName('Sauce Labs Backpack');
        await this.addProductByName('Sauce Labs Bike Light');
        await this.addProductByName('Sauce Labs Bolt T-Shirt');
        await this.addProductByName('Sauce Labs Fleece Jacket');
        await this.addProductByName('Sauce Labs Onesie');
        await this.addProductByName('Test.allTheThings() T-Shirt (Red)');
    }
}

export default InventoryPage;
