import {test,expect,Locator,Page} from '@playwright/test';
async function datePicker(page:Page,targetDate:string,targetMonth:string,targetYear:string)
{
    let year=page.locator('.ui-datepicker-year');
    await year.selectOption(targetYear);
    await page.selectOption('.ui-datepicker-month',targetMonth);
    let dates:Locator[]= await page.locator("td[data-handler='selectDay'] a").all();
    for(let date of dates)
    {
       let dateTxt:string=await date.innerText();
       if(dateTxt===targetDate)
       {
            await date.click();
            break;
       }
    }
}

test('Automate booking datepicker',async({page})=>
{
    await page.goto('https://www.dummyticket.com/dummy-ticket-for-visa-application/');
    await page.click('#product_549');
    // enter passanger deatils
    await page.fill('#travname','Akash');
    await page.fill('#travlastname','ahire');
    //select date of birth
    let targetDate='11';
    let targetYear:string='2001';
    let targetMonth:string='Mar';
    await page.click('#dob');
    await datePicker(page,targetDate,targetMonth,targetYear);
    
    //select gender
   await page.check('#sex_1');
    //enter travel details
    //select trip type
    await page.check('#traveltype_2');
    await page.fill('#fromcity','Toronto');
    await page.fill('#tocity','Mumbai');
    //select travel date
    await page.click('#departon');
    await datePicker(page,"10","Dec","2026");
    //return date
    await page.click('#returndate');
    await datePicker(page,"17","Dec","2026");
    //aditional information
    await page.fill('#notes','Need visa as soon as possible');
    //deliver option
    await page.click('#select2-reasondummy-container');
    await page.click("//li[text()='Office work place needs it']");
  /*   await page.click('input[name="appoinmentdate"]');
    await datePicker(page,"12","Mar","2026"); */
    await page.click('#deliverymethod_3');
    //enter billing details
    await page.fill('#billname','akash ahire');
    await page.fill('#billing_phone','7020151213');
    await page.fill('#billing_email','abc@xyz.com');
    await page.locator('#select2-billing_country-container').click();
    let countries:Locator[]=await page.locator('.select2-results__option').all();
    for(let  country of countries )
    {
       let countryName:string= await country.innerText();
       if(countryName==='India')
       {
        await country.click();
        break;
       }
    }
    await page.fill('#billing_address_1','12');
    await page.fill('#billing_city','Mumbai');
    await page.locator('#select2-billing_country-container').click();
    await page.click('#select2-billing_state-container');
    let states:Locator[]=await page.locator('.select2-results__option').all();
    for(let  country of countries )
    {
       let countryName:string= await country.innerText();
       if(countryName==='Maharashtra')
       {
        await country.click();
        break;
       }
    }
    await page.fill('#billing_postcode','423301');



});