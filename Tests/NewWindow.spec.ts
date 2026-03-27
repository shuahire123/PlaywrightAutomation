import {expect,test,chromium} from '@playwright/test';
test("new window handeling",async()=>
{
    const browser = await chromium.launch({headless:false});
    const context = await browser.newContext();
    const mainPage = await context.newPage();
    await mainPage.goto("https://www.tutorialspoint.com/selenium/practice/browser-windows.php");
    const [popupPage]=await Promise.all([mainPage.waitForEvent('popup'),mainPage.locator("//button[text()='New Window']").click()]);
     expect(await popupPage.title()).toEqual("Selenium Practice - Web Tables");
    expect(await popupPage.locator("h1.mb-3").innerText()).toEqual("New Window")

})