import { Page } from '@playwright/test';

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
        this.errorLoginFailed = this.page.locator('h3[data-test="error"]');
    }

    async doLogin(username, password) {
        await this.userInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async validateLoginFailed() {
        console.log('[DEBUG] Waiting for error message');
        await this.errorLoginFailed.waitFor();
        const errorMessage = await this.errorLoginFailed.textContent();
        console.log('[DEBUG] Error message text:', errorMessage);
        return errorMessage.includes('Epic sadface: Username and password do not match any user in this service');
    }   
}

export default LoginPage;