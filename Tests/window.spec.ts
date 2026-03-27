import {test,expect,chromium} from '@playwright/test';
test("window handeling",async()=>
{
    let browser = await chromium.launch();
    let context= await browser.newContext();
    let page = await context.newPage();
    await page.goto("https://www.tutorialspoint.com/selenium/practice/browser-windows.php");
   const [newPage]= await Promise.all([context.waitForEvent('page'),page.locator('button',{hasText:'New Tab'}).click()]);
    expect(await newPage.title()).toEqual("Selenium Practice - Web Tables");
    console.log(await newPage.locator("div.row").textContent());
    expect((await newPage.locator("div.row").innerText()).trim()).toContain("Sample New Tab");
})