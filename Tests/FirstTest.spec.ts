import {test, expect} from '@playwright/test';
test('validate the page title', async ({page}) => {
    await page.goto('https://www.google.com');
    //let title=await page.title();
    await expect(page).toHaveTitle('Google');
    //expect(await page.title()).toHaveTitle('Google');
});