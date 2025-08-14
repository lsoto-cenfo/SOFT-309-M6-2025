import { expect } from '@playwright/test';

class FinishPage {
    constructor(page) {
        this.page = page;
    }

    async validateOrderComplete() {
        await this.page.waitForURL('**/checkout-complete.html');
        const headerLocator = this.page.locator('.complete-header');
        await expect(headerLocator).toBeVisible();
        
        console.log('✅ Order completion page loaded successfully');
    }

    async validateThankYouMessage() {
        const thankYouHeader = this.page.locator('.complete-header');
        await expect(thankYouHeader).toContainText('THANK YOU FOR YOUR ORDER');
        const completionText = this.page.locator('.complete-text');
        await expect(completionText).toBeVisible();
        
        console.log('✅ Thank you message validated successfully');
    }

    async getCompletionMessage() {
        const messageLocator = this.page.locator('.complete-text');
        return await messageLocator.textContent();
    }

    async validateCompletionImage() {
        const imageLocator = this.page.locator('.pony_express');
        await expect(imageLocator).toBeVisible();
        
        console.log('✅ Order completion image validated');
    }

    async validateCompleteOrderSection() {
        await this.validateOrderComplete();
        await this.validateThankYouMessage();
        await this.validateCompletionImage();
        
        console.log('✅ Complete order finish section validated successfully');
    }
}

export default FinishPage;
