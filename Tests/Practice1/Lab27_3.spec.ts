/* //Irctc treain search automation
import{test,expect,Page,Locator} from '@playwright/test';
test('Irctc treain search automation',async({page})=>
{
    await page.goto('https://www.irctc.co.in/nget/train-search');
    //enter departure city
    let deptCity:Locator= page.locator("input[aria-controls='pr_id_1_list']");
    await expect(deptCity).toBeVisible();
    await deptCity.fill('n');
   let allCitiesDept:Locator[]= await page.locator('#pr_id_1_list >li>span>strong').all();
   for(let city of allCitiesDept)
   {
        let str:string=await city.innerText();
        let cityName=str.replace(/[()]/g, "").toLowerCase();
        if(cityName==='nashik')
        {
            await city.click();
            break;
        }

   }
   let arrCity:Locator=page.locator("input[aria-controls='pr_id_2_list']");
   await expect(arrCity).toBeVisible();
   await arrCity.fill("c");
   let allCitiesArr:Locator[]=await page.locator("#pr_id_2_list>li>span>strong").all();
    for(let city of allCitiesArr)
   {
        let str:string=await city.innerText();
        let cityName=str.replace(/[()]/g, "").toLowerCase();
        if(cityName==='coimbatore')
        { 
            await city.click();
            break;
        }

   }
   let bookingMonth:string='June';
   let bookingYear:string='2026';
   //open datepicker
   await page.click('.ng-tns-c69-9.ui-calendar > input');
  
   while (true) {

    let month: string = await page.locator(".ui-datepicker-month").innerText();
    let year: string = await page.locator(".ui-datepicker-year").innerText();

    if (month === bookingMonth && year === bookingYear) {
        break;
    } 
    else {
        await page.click('.ui-datepicker-next');
    }
}

// capture all dates
let dates = page.locator("//table[contains(@class,'ui-datepicker-calendar')]//a");

let count = await dates.count();
let dateFound = false;

for (let i = 0; i < count; i++) {

    let date = dates.nth(i);
    let dateText = await date.innerText();

    if (dateText === '18') {

        dateFound = true;

        if (await date.isEnabled()) {
            await date.click();
            console.log("Date selected:", dateText);
        } 
        else {
            console.log("Date is disabled. Please select another date:", dateText);
        }

        break;
    }
}

if (!dateFound) {
    console.log("Date not available in calendar");
}
   await page.waitForTimeout(2000);
   


}); */