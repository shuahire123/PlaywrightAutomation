//getByRole
import {test,expect,Locator} from '@playwright/test';
test('Playwright Locators',async({page})=>
{
    await page.goto('http://127.0.0.1:5500/Tests/app.html');
    const checkbox1:Locator = page.getByRole('checkbox',{name:'Accept terms'});
    await checkbox1.click();
   await expect(checkbox1).toBeChecked();

   //getBytext
   await expect( page.getByText('List item 1')).toBeVisible();
   //getByLable
   await page.getByLabel('Email Address:').fill("shubham");
    //getByPlaceholder
    await page.getByPlaceholder('Type your message here...').fill("Hello this is test message");
    //getByAltText
    await expect(page.getByAltText('logo image')).toBeVisible();
    //getByTitle
    await expect(page.getByTitle('Tooltip text')).toBeVisible();
    //getByTestId
    await expect(page.getByTestId('nav-home')).toBeVisible();
});