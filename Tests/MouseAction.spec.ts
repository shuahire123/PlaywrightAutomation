import {test, expect, Locator} from '@playwright/test';
test('MouseAction',async({page})=>
{
    await page.goto("http://demo.guru99.com/test/drag_drop.html");
    const amount:Locator=page.locator(".block13.ui-draggable").first();
    const debitAmt:Locator=page.locator("#amt7");
    const creditAmt:Locator=page.locator("#amt8");
    const bank:Locator=page.locator("#credit2");
    const sales:Locator=page.locator("#credit1");
    const debitAcc:Locator=page.locator("#shoppingCart1");
    const creditAcc:Locator=page.locator("#shoppingCart3");
    await amount.dragTo(debitAmt);
    await amount.dragTo(creditAmt);
    await page.waitForTimeout(2000);
    await bank.dragTo(debitAcc);
    await page.waitForTimeout(2000);
    await sales.dragTo(creditAcc);
    console.log(await page.locator(".table4_result a").textContent());
    //expect( await page.locator(".table4_result a").textContent()).toEqual("Perfect!");
    await page.waitForTimeout(5000);

});