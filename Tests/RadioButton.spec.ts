//valiadte radio button
import {test,expect} from '@playwright/test';
test('validate radio button',async({page})=>
{
    await page.goto('https://www.tutorialspoint.com/selenium/practice/radio-button.php');
    const yesRadioBtn=page.locator("xpath=//label[contains(text(),'Yes')]/preceding-sibling::input");
    const impressiveRadioBtn=page.locator("//label[contains(text(),'Impressive')]/preceding-sibling::input");
    const noRadioBtn=page.locator("//label[contains(text(),'No (Disable)')]/preceding-sibling::input");
    yesRadioBtn.isVisible();
    yesRadioBtn.isEnabled();
    yesRadioBtn.check();
    
});