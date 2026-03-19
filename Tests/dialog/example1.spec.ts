import { test, expect } from '@playwright/test';

/*test.only('dialog example 1', async ({ page }) => {
    await page.goto('https://www.tutorialspoint.com/selenium/practice/alerts.php');

    page.on('dialog', async (dialog) => {
        let msg: string = dialog.message();
        expect(msg).toEqual('Hello world!');
        console.log('type of dialog:', dialog.type());
        await dialog.accept(); 
    });

    // ✅ Added await
    await page.locator("//label[contains(text(),'see alert')]/following-sibling::button").click();
});

test.only('dialog example 2', async ({ page }) => {
    await page.goto('https://www.tutorialspoint.com/selenium/practice/alerts.php');

    page.on('dialog', async (dialog) => {
        let msg: string = dialog.message();
        expect(msg).toBe('Hello just appeared');
        console.log(dialog.type());
        await dialog.accept(); 
    });

    await page.click("//label[contains(text(),'5 seconds')]/following-sibling::button");
});

test.only('dialog example 3', async ({ page }) => {
    await page.goto('https://www.tutorialspoint.com/selenium/practice/alerts.php');

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain("button!");
        console.log(dialog.type());
        await dialog.accept(); 
    });

    await page.click("//label[contains(text(),'confirm')]/following-sibling::button");

    let msg: string = await page.locator("//div[contains(text(),'You pressed')]").innerText();
    if (msg === 'You pressed OK!') {
        console.log("button : ", msg);
    } else {
        console.log("button : ", msg);
    }
}); */
test('dialog 4',async({page})=>
{
    await page.goto('https://www.tutorialspoint.com/selenium/practice/alerts.php');
    page.on('dialog',(dialog)=>
    {   console.log(dialog.type);
        dialog.accept('malhar');
    });
    await page.click("//label[contains(text(),'prompt')]/following-sibling::button");
})