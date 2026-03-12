import {test,expect,Locator} from '@playwright/test';
test('Practice Radio box ',async({page})=>
{
    await page.goto("https://www.tutorialspoint.com/selenium/practice/radio-button.php");
    //locate radio button
    let yesRadioBtn:Locator=page.locator("//label[contains(text(),'Yes')]/preceding-sibling::input");
    await expect(yesRadioBtn).toBeEnabled();
    yesRadioBtn.check();
    await expect(yesRadioBtn).toBeChecked();
    let yesTxt:string =await page.locator("#check b").innerText();
    expect(yesTxt).toEqual("Yes");
    let ImpressiveRadioBtn:Locator= page.locator("input[onclick='show3();']");
    await ImpressiveRadioBtn.setChecked(true);
    let ImpressiveTxt = await page.locator("#check1 b").textContent();
    console.log(typeof ImpressiveTxt);
    expect(ImpressiveTxt).toEqual("Impressive");




});