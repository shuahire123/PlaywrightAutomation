import{test,expect, Locator} from '@playwright/test';
test("checkbox test",async({page})=>
{
    await page.goto("https://www.tutorialspoint.com/selenium/practice/check-box.php");
    const checkbox1:Locator=page.locator("#c_bs_1");
     await expect(checkbox1).not.toBeChecked();
    await checkbox1.check();
   await expect(checkbox1).toBeChecked();
   await page.click('#bs_1>.plus');
   if(await page.locator('#c_bf_1').isChecked())
   {
    await page.locator('#bf_1>.plus').click();
   }
   else
   {
    await page.locator('#c_bf_1').check();
   }
});