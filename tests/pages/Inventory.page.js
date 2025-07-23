import { expect, Page } from '@playwright/test';

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
        await expect(this.inventoryTitle).toBeVisible();
    }
}

export default InventoryPage;