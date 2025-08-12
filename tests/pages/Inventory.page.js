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
        this.checkoutButton = this.page.locator('a.btn_action.checkout_button');
        this.firstNameInput = this.page.locator('input[data-test="firstName"]');
        this.lastNameInput = this.page.locator('input[data-test="lastName"]');
        this.postalCodeInput = this.page.locator('input[data-test="postalCode"]');
        this.continueButton = this.page.locator('input.btn_primary.cart_button[type="submit"][value="CONTINUE"]');
        this.finishButton = this.page.locator('a.btn_action.cart_button[href="./checkout-complete.html"]');
        this.cancelButton = this.page.locator('a.cart_cancel_link.btn_secondary[href="./inventory.html"]');
        this.cartBadge = this.page.locator('span.shopping_cart_badge');
        this.itemTotal = this.page.locator('div.summary_subtotal_label');
        this.tax = this.page.locator('div.summary_tax_label');
        this.totalPrice = this.page.locator('div.summary_total_label');
        this.inventoryDetailsName = this.page.locator('div.inventory_details_name');
        this.inventoryDetailsDesc = this.page.locator('div.inventory_details_desc');
        // Only static locators in constructor

    }

    validateInventoryTitleLoaded = async () => {
        await expect(this.inventoryTitle).toBeVisible();
    }

    async addItemToCart(itemName1) {
        const itemAddButton = this.page.locator(`.inventory_item:has-text("${itemName1}") button.btn_primary.btn_inventory`);
        await itemAddButton.waitFor({ state: 'visible' });
        await itemAddButton.click();
        const cartItemCount = await this.cartBadge.textContent();
        expect(cartItemCount).toBe('1'); // Assuming we expect one item to be
    }

    async removeItemFromCart(itemName1) {
        const itemRemoveButton = this.page.locator(`.inventory_item:has-text("${itemName1}") button.btn_secondary.btn_inventory`);
        await itemRemoveButton.waitFor({ state: 'visible' });
        await itemRemoveButton.click();
        expect(await this.cartBadge.count()).toBe(0); // Expect no badge when cart is empty
    }

    async validateCheckoutOverviewPage(itemName1, user) {
        await this.addItemToCart(itemName1);
        await this.cartBadge.click(); // Click on the cart icon
        await this.checkoutButton.click(); // Click on the checkout button
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.postalCodeInput.fill(user.postalCode);
        await this.continueButton.click(); // Click on the continue button
    }

    async completeOrderWithItem(itemName1, user) {
        await this.validateCheckoutOverviewPage(itemName1, user); // Ensure we are on the checkout overview page
        await this.finishButton.click(); // Click on the finish button to complete the order\
         // assertions 
        const orderCompleteMessage = this.page.locator('h2.complete-header');
        await expect(orderCompleteMessage).toHaveText('THANK YOU FOR YOUR ORDER');
        expect(await this.cartBadge.count()).toBe(0); // Expect no items in the cart after order

    }

    async cancelOrder(itemName1, user) {
        await this.validateCheckoutOverviewPage(itemName1, user);
        await this.cancelButton.click(); // Click on the cancel button
         // assertions 
        expect(await this.cartBadge.count()).toBe(1); // Expect no items in the cart after cancellation
    }   

    async validateTotalPrice(itemName1, user) {
        await this.validateCheckoutOverviewPage(itemName1, user);
        // Get item total
        const itemTotalText = await this.itemTotal.textContent(); // e.g. 'Item total: $45.98'
        const itemTotalValue = parseFloat(itemTotalText.replace(/[^\d.]/g, ''));

        // Get tax
        const taxText = await this.tax.textContent(); // e.g. 'Tax: $3.68'
        const taxValue = parseFloat(taxText.replace(/[^\d.]/g, ''));

        // Get total price
        const totalPriceText = await this.totalPrice.textContent(); // e.g. 'Total: $49.66'
        const totalPriceValue = parseFloat(totalPriceText.replace(/[^\d.]/g, ''));

        // Compare sum
        expect(itemTotalValue + taxValue).toBeCloseTo(totalPriceValue, 2);
    }

    async checkInventoryItemNames(...itemNames) {
        for (const itemName of itemNames) {
            // Click on the inventory item link
            const itemLink = this.page.locator(`div.inventory_item_name:has-text("${itemName}")`);
            await itemLink.click();
            console.log('[DEBUG] Items:', itemName);
            // Check that the opened page contains the item name
            await expect(this.inventoryDetailsName).toHaveText(itemName);
            await expect(this.inventoryDetailsDesc).toBeVisible();
            // Go back to inventory page for next item
            await this.page.goBack();
        }
    }


}


export default InventoryPage;