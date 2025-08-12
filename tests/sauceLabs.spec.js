/* import { test } from "@playwright/test";
import LoginPage from "../tests/pages/Login.page.js";

test("Tesing buttons", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/v1/index.html");
  const login = new LoginPage(page);
  await login.doLogin("standard_user", "secret_sauce");

  const productsAddButtons = await page
    .locator('button[class="btn_primary btn_inventory"]')
    .all();

    const randomNumber = Math.floor(Math.random() * productsAddButtons.length);
    await productsAddButtons[randomNumber].click();
  
  await console.log("Products added to cart");
});*/
