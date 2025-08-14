import { Page, expect } from '@playwright/test';

class Checkout2Page {
    /** @type {Page} */
    page;

    /**
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
        this.checkoutTitle = this.page.locator('.subheader');
        this.cartItems = this.page.locator('.cart_item');
        this.itemNames = this.page.locator('.inventory_item_name');
        this.itemDescriptions = this.page.locator('.inventory_item_desc');
        this.itemPrices = this.page.locator('.inventory_item_price');
        this.itemQuantities = this.page.locator('.cart_quantity');
        this.summaryContainer = this.page.locator('.checkout_summary_container');
        this.paymentInformation = this.page.locator('.summary_info_label').filter({ hasText: 'Payment Information:' });
        this.shippingInformation = this.page.locator('.summary_info_label').filter({ hasText: 'Shipping Information:' });
        this.priceTotal = this.page.locator('.summary_info_label').filter({ hasText: 'Price Total' });
        this.subtotalLabel = this.page.locator('.summary_subtotal_label');
        this.taxLabel = this.page.locator('.summary_tax_label');
        this.totalLabel = this.page.locator('.summary_total_label');
        this.cancelButton = this.page.locator('a[class*="cart_cancel_link"]');
        this.finishButton = this.page.locator('a[class*="btn_action cart_button"]');
        this.paymentInfo = this.page.locator('.summary_value_label').first();
        this.shippingInfo = this.page.locator('.summary_value_label').last();
    }

    async finishOrder() {
        await this.finishButton.click();
        await this.page.waitForURL('**/checkout-complete.html');
    }

    async cancelOrder() {
        await this.cancelButton.click();
        await this.page.waitForURL('**/inventory.html');
    }

    async validateCheckoutStep2PageLoaded() {
        await this.checkoutTitle.waitFor({ state: 'visible' });
        await expect(this.checkoutTitle).toHaveText('Checkout: Overview');
    }

    async validateOrderSummaryVisible() {
        await expect(this.summaryContainer).toBeVisible();
        await expect(this.paymentInformation).toBeVisible();
        await expect(this.shippingInformation).toBeVisible();
    }

    async validateItemInSummary(itemName) {
        const itemLocator = this.page.locator('.cart_item').filter({ hasText: itemName });
        await expect(itemLocator).toBeVisible();
    }

    async validateItemsCount(expectedCount) {
        await expect(this.cartItems).toHaveCount(expectedCount);
    }

    async validateSubtotal(expectedSubtotal) {
        await expect(this.subtotalLabel).toContainText(`Item total: $${expectedSubtotal}`);
    }

    async validateTax(expectedTax) {
        await expect(this.taxLabel).toContainText(`Tax: $${expectedTax}`);
    }

    async validateTotal(expectedTotal) {
        await expect(this.totalLabel).toContainText(`Total: $${expectedTotal}`);
    }

    async validatePaymentInformation(expectedPaymentInfo = 'SauceCard #31337') {
        await expect(this.paymentInfo).toHaveText(expectedPaymentInfo);
    }

    async validateShippingInformation(expectedShippingInfo = 'FREE PONY EXPRESS DELIVERY!') {
        await expect(this.shippingInfo).toHaveText(expectedShippingInfo);
    }

    async validateFinishButtonVisible() {
        await expect(this.finishButton).toBeVisible();
        await expect(this.finishButton).toBeEnabled();
        await expect(this.finishButton).toHaveText('FINISH');
    }

    async validateCancelButtonVisible() {
        await expect(this.cancelButton).toBeVisible();
        await expect(this.cancelButton).toBeEnabled();
        await expect(this.cancelButton).toHaveText('CANCEL');
    }

    async getItemNames() {
        const names = await this.itemNames.allTextContents();
        return names;
    }

    async getItemPrices() {
        const prices = await this.itemPrices.allTextContents();
        return prices.map(price => parseFloat(price.replace('$', '')));
    }

    async getItemQuantities() {
        const quantities = await this.itemQuantities.allTextContents();
        return quantities.map(qty => parseInt(qty));
    }

    async getSubtotal() {
        const subtotalText = await this.subtotalLabel.textContent();
        const match = subtotalText.match(/\$(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    async getTax() {
        const taxText = await this.taxLabel.textContent();
        const match = taxText.match(/\$(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    async getTotal() {
        const totalText = await this.totalLabel.textContent();
        const match = totalText.match(/\$(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    async calculateExpectedTotal() {
        const subtotal = await this.getSubtotal();
        const tax = await this.getTax();
        return subtotal + tax;
    }

    // Comprehensive validation methods
    async validateCompleteOrderSummary(expectedItems = []) {
        await this.validateCheckoutStep2PageLoaded();
        await this.validateOrderSummaryVisible();
        
        if (expectedItems.length > 0) {
            await this.validateItemsCount(expectedItems.length);
            for (const item of expectedItems) {
                await this.validateItemInSummary(item);
            }
        }
        
        await this.validateFinishButtonVisible();
        await this.validateCancelButtonVisible();
        await this.validatePaymentInformation();
        await this.validateShippingInformation();
    }

    async validatePriceCalculations() {
        const calculatedTotal = await this.calculateExpectedTotal();
        const displayedTotal = await this.getTotal();
        
        expect(Math.abs(calculatedTotal - displayedTotal)).toBeLessThan(0.01); // Allow for rounding differences
    }

    async waitForPageToLoad() {
        await this.page.waitForSelector('.checkout_summary_container');
        await this.checkoutTitle.waitFor({ state: 'visible' });
    }

    async takeScreenshot(filename = 'checkout-step-2') {
        await this.page.screenshot({ 
            path: `test-results/${filename}-${Date.now()}.png`,
            fullPage: true 
        });
    }
}

export default Checkout2Page;
