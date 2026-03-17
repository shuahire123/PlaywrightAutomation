import{test,expect,Locator} from '@playwright/test';
test('input box method practice',async({page})=>
{
    await page.goto("https://www.tutorialspoint.com/selenium/practice/text-box.php");
    const fullNametxt:Locator=page.locator('#fullname');
    await expect(fullNametxt).toBeVisible();
    await fullNametxt.clear();
    await fullNametxt.fill("shubham ahire");
    let inputText:string=await fullNametxt.inputValue();
    console.log(inputText);

})