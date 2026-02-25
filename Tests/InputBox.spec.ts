import {test,expect,Locator} from '@playwright/test';
test("input box",async({page})=>
{   page.goto('https://www.tutorialspoint.com/selenium/practice/text-box.php');
    let fullNameInput:Locator = page.getByPlaceholder('Full Name');
    await expect(fullNameInput).toBeEnabled();
    await expect(fullNameInput).toBeVisible();
    await fullNameInput.fill("malhar ahire");
    //let fullNameText:string | null =await fullNameInput.textContent();
    //console.log(fullNameText)
    let fullNameValue :string = await fullNameInput.inputValue();
    expect(fullNameValue).toBe('malhar ahire');
});