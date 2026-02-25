import {test,expect,Locator} from '@playwright/test';
test('dropdown',async({page})=>
{
    page.goto('https://www.tutorialspoint.com/selenium/practice/selenium_automation_practice.php');
    let stateDropdown: Locator  = page.locator('#state');
    await stateDropdown.selectOption('Haryana');
    await page.waitForTimeout(2000);
    await stateDropdown.selectOption('NCR');
    await stateDropdown.selectOption({value:'Uttar Pradesh'});
    let cityDropdown: Locator = page.locator('#city');
    await cityDropdown.selectOption({label:'Agra'});
    await cityDropdown.selectOption({index:3});

})
