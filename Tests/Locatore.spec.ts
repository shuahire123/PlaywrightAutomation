//getByRole
import {test,expect,Locator} from '@playwright/test';
test('Playwright Locators',async({page})=>
{
    await page.goto('http://127.0.0.1:5500/Tests/app.html');
    const checkbox1:Locator = page.getByRole('checkbox',{name:'Accept terms'});
    await checkbox1.click();
   await expect(checkbox1).toBeChecked();

});