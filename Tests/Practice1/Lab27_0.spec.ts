//Automate datePicker
import {test,expect,Locator,Page} from '@playwright/test';
test('Automate date picker',async({page})=>
{
    await page.goto('https://testautomationpractice.blogspot.com/');
    let dateInput:Locator=page.locator('#txtDate').nth(0);
    //validate date picker is avilable 
   await expect(dateInput).toBeVisible();
    //click on date picker
    dateInput.click();
    const targetYear:string='2027';
    const targetMonth:string='Jun';
    const targetDate:string='30';

    //select year
    let year:Locator=page.locator('.ui-datepicker-year');
    await year.selectOption(targetYear);
    //select Month
    let month:Locator=page.locator('.ui-datepicker-month');
   await month.selectOption(targetMonth);
    //select date
    let dates:Locator[]=await page.locator('.ui-datepicker-calendar td a').all();
    for(let date of dates)
    {
        let dateTxt:string=await date.innerText();
        if(dateTxt===targetDate)
        {
            await date.click();
            break;
        }
    }
   let selectedDate:string= await dateInput.inputValue();
   console.log(selectedDate);

});