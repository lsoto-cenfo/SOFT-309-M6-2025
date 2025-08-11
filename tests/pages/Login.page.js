import { Page, expect } from '@playwright/test';

class LoginPage {
    /** @type {Page} */
    page;

    /**
     * @param {Page} page
     */
    constructor(page){
        this.page = page;
        this.userInput = this.page.locator('input[data-test="username"]');
        this.passwordInput = this.page.locator('input[data-test="password"]');
        this.loginButton = this.page.locator('input[id="login-button"]');
    }

    async doLogin(username, password) {
        await this.userInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async validateErrorMessage() {
        const errorMessage = this.page.locator('h3[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        return errorMessage;
    }
}

export default LoginPage;