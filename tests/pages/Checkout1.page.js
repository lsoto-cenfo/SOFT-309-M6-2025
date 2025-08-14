import { Page, expect } from '@playwright/test';

class Checkout1Page {
    /** @type {Page} */
    page;

    /**
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
        this.checkoutTitle = this.page.locator('.subheader');
        this.firstNameField = this.page.locator('[data-test="firstName"]');
        this.lastNameField = this.page.locator('[data-test="lastName"]');
        this.postalCodeField = this.page.locator('[data-test="postalCode"]');
        this.continueButton = this.page.locator('input.btn_primary[type="submit"]');
        this.cancelButton = this.page.locator('a[class*="cart_cancel_link"]');
        this.errorMessage = this.page.locator('[data-test="error"]');
    }

    async fillCustomerInformation(firstName, lastName, postalCode) {
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.postalCodeField.fill(postalCode);
    }

    async continueToStep2() {
        await this.continueButton.click();
        await this.page.waitForURL('**/checkout-step-two.html');
    }

    async cancelCheckout() {
        await this.cancelButton.click();
        await this.page.waitForURL('**/cart.html');
    }

    async validateCheckoutStep1PageLoaded() {
        await this.checkoutTitle.waitFor({ state: 'visible' });
        await expect(this.checkoutTitle).toHaveText('Checkout: Your Information');
    }

    async validateFormFieldsVisible() {
        await expect(this.firstNameField).toBeVisible();
        await expect(this.lastNameField).toBeVisible();
        await expect(this.postalCodeField).toBeVisible();
        await expect(this.continueButton).toBeVisible();
        await expect(this.cancelButton).toBeVisible();
    }

    async validateErrorMessage(expectedMessage) {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(expectedMessage);
    }

    async validateRequiredFieldError() {
        await this.validateErrorMessage('Error: First Name is required');
    }

    async clearForm() {
        await this.firstNameField.clear();
        await this.lastNameField.clear();
        await this.postalCodeField.clear();
    }

    async submitEmptyForm() {
        await this.continueButton.click();
    }
}

export default Checkout1Page;
