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

    addSauceLabsBackpackToCart = async () => {
        await this.page.waitForSelector('.inventory_item');
        const addItemButton = this.page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' }).locator('button');
        await addItemButton.click();
    }

    removeSauceLabsBackpackFromCart = async () => {
        await this.page.waitForSelector('.inventory_item');
        const removeItemButton = this.page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' }).locator('button');
        await removeItemButton.click();
    }

    addSauceLabsBikelightToCart = async () => {
        await this.page.waitForSelector('.inventory_item');
        const addItemButton = this.page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' }).locator('button');
        await addItemButton.click();
    }

    addSauceLabsBoltTshirtToCart = async () => {
        await this.page.waitForSelector('.inventory_item');
        const addItemButton = this.page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bolt T-Shirt' }).locator('button');
        await addItemButton.click();
    }

    addSauceLabsFleeceJacketToCart = async () => {
        await this.page.waitForSelector('.inventory_item');
        const addItemButton = this.page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Fleece Jacket' }).locator('button');
        await addItemButton.click();
    }   

    addSauceLabsOnesieToCart = async () => {
        await this.page.waitForSelector('.inventory_item');
        const addItemButton = this.page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Onesie' }).locator('button');
        await addItemButton.click();
    }   

    addTestAllTheThingsTShirtToCart = async () => {
        await this.page.waitForSelector('.inventory_item');
        const addItemButton = this.page.locator('.inventory_item').filter({ hasText: 'Test.allTheThings() T-Shirt (Red)' }).locator('button');
        await addItemButton.click();
    }   

    addAllItemsToCart = async () => {
        await this.addSauceLabsBackpackToCart();
        await this.addSauceLabsBikelightToCart();
        await this.addSauceLabsBoltTshirtToCart();
        await this.addSauceLabsFleeceJacketToCart();
        await this.addSauceLabsOnesieToCart();
        await this.addTestAllTheThingsTShirtToCart();
    }   
}

export default InventoryPage;
