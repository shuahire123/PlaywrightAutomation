import {test,expect,Locator} from '@playwright/test';
test('checkbox practice', async({page})=>
{
    await page.goto('https://www.tutorialspoint.com/selenium/practice/check-box.php');
    let MainLevel1Chkbx:Locator=page.locator('#c_bs_1');
    await expect(MainLevel1Chkbx).toBeVisible();
    await expect(MainLevel1Chkbx).toBeEnabled();
    await MainLevel1Chkbx.check();
    await expect(MainLevel1Chkbx).toBeChecked();
    
});