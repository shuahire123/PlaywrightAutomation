import {test,expect,chromium} from '@playwright/test';
test("authentication popup",async()=>
{
    const browser=await chromium.launch({headless:true});
    const context=await browser.newContext({httpCredentials:{username:'admin',password:'admin'}});
    const page=await context.newPage();
    await page.goto("https://the-internet.herokuapp.com/basic_auth");
    const text:string=await page.locator(".large-12").last().locator("p").innerText();
    expect(text).toContain("Congratulations");

})