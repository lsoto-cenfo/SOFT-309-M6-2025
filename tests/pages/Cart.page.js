import { Page, expect } from '@playwright/test';

class CartPage {
    /** @type {Page} */
    page;

    /**
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
        
        // Cart page elements
        this.cartTitle = this.page.locator('.subheader');
        this.cartItems = this.page.locator('.cart_item');
        this.cartItemNames = this.page.locator('.inventory_item_name');
        this.cartItemPrices = this.page.locator('.inventory_item_price');
        this.removeButtons = this.page.locator('button[class*="btn_secondary"]');
        this.continueShoppingButton = this.page.locator('a[class="btn_secondary"]');
        this.checkoutButton = this.page.locator('a[class="btn_action checkout_button"]');
        this.cartBadge = this.page.locator('.shopping_cart_badge');
        this.cartIcon = this.page.locator('.shopping_cart_link');
    }

    async navigateToCart() {
        await this.cartIcon.click();
        await this.page.waitForURL('**/cart.html');
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
        await this.page.waitForURL('**/inventory.html');
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
        await this.page.waitForURL('**/checkout-step-one.html');
    }

    async validateCartPageLoaded() {
        await this.cartTitle.waitFor({ state: 'visible' });
        await expect(this.cartTitle).toHaveText('Your Cart');
    }

    async validateCartItemCount(expectedCount) {
        if (expectedCount === 0) {
            await expect(this.cartItems).toHaveCount(0);
            await expect(this.cartBadge).not.toBeVisible();
        } else {
            await expect(this.cartItems).toHaveCount(expectedCount);
            await expect(this.cartBadge).toHaveText(expectedCount.toString());
        }
    }

    async validateItemInCart(itemName) {
        const itemLocator = this.page.locator('.cart_item').filter({ hasText: itemName });
        await expect(itemLocator).toBeVisible();
    }

    async validateCartIsEmpty() {
        await expect(this.cartItems).toHaveCount(0);
        await expect(this.cartBadge).not.toBeVisible();
    }

    async removeItemFromCart(itemName) {
        const itemContainer = this.page.locator('.cart_item').filter({ hasText: itemName });
        const removeButton = itemContainer.locator('button');
        await removeButton.click();
    }

    // Information retrieval methods
    async getCartItemNames() {
        const names = await this.cartItemNames.allTextContents();
        return names;
    }

    async getCartItemPrices() {
        const prices = await this.cartItemPrices.allTextContents();
        return prices;
    }

    async getCartItemCount() {
        return await this.cartItems.count();
    }

    // Utility methods
    async waitForCartToLoad() {
        await this.page.waitForSelector('.cart_contents_container');
        await this.cartTitle.waitFor({ state: 'visible' });
    }

}

export default CartPage;
