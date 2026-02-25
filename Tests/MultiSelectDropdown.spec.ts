/* import {test,expect,Locator} from '@playwright/test';
test('Multi select dropdown', async({page})=>
{
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    //login
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.locator('.oxd-button.oxd-button--medium.oxd-button--main.orangehrm-login-button').click();
    
    //click on PIM 
   let PIM:Locator=  page.getByText("PIM");
   /* let result: boolean=await PIM.isVisible();
    expect(result).toBe(true); 
   await PIM.click();
    
    await page.locator("form i").nth(2).click();
    let DropdownOption : Locator[]=await page.locator('.oxd-select-option > span').all();
    for(let option of DropdownOption)
    {
        let text : string = await option.innerText();
        console.log(text);
    }


}) */
