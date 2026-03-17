import {Locator, test,expect} from '@playwright/test';
test('BlazeDemo – Flight Booking Automation',async({page})=>
{   //launch website
    await page.goto('https://blazedemo.com/');
    //select depature and destination
    let departureCityDD:Locator= page.locator('.form-inline').first();
    await expect(departureCityDD).toBeEnabled();
    departureCityDD.click();
    //select departure city
    departureCityDD.selectOption({label:'Boston'});
    //select destination city
     let destinationCityDD:Locator= page.locator('.form-inline').last();
    await expect(destinationCityDD).toBeEnabled();
    destinationCityDD.click();
    //select departure city
    destinationCityDD.selectOption({label:'London'});
    //search for flights
    await page.click('input[type="submit"]');
    //total number of flights
    let totalFlights:Locator=page.locator('//tbody//tr');
    //print flight prices
    let prices:string[]=await totalFlights.locator("//td[contains(text(),'$')]").allInnerTexts();
    let sortedPrices:string[]=prices.map((value)=>
    {
       return value.replace('$','');
    }).sort();
    let minPrice=sortedPrices[0];
    let count=await totalFlights.count();
    for(let f=0;f<= count-1;f++)
    {
        let flightsDetails= totalFlights.nth(f).locator('//td');
        let Colcount=await flightsDetails.count();
        //console.log(Colcount);
        let price=(await flightsDetails.last().innerText()).replace('$','');
        if(price===minPrice)
        {
            await flightsDetails.first().click();
            break;
        } 
    };
    //validate you have slected cheapest flight 
    let price:string=(await page.locator("//p[contains(text(),'Price:')]").innerText()).replace('Price: ','');
    console.log(minPrice,price);
    //expect(minPrice).toEqual(price);
    //enter name
    await page.fill('#inputName','shubham ahire');
    //enter adress
    await page.fill('#address','Plot no 44, Chogaon road, Tirupati nagar, satana. Nashik District 423301 Maharashtra');
    await page.fill('#city','nashik');
    await page.fill('#state','maharashtra');
    await page.fill('#zipCode','423301');
    //select card type
   let cardType:Locator= page.locator('#cardType');
   await cardType.selectOption({label:'American Express'});
    await page.fill('#creditCardNumber','4242424242424242');
    await page.fill('#creditCardMonth','11');
    await page.fill('#creditCardYear','2025');
    await page.fill('#nameOnCard','shubham ahire');
    let chkbox:Locator=page.locator('#rememberMe');
    await expect(chkbox).toBeVisible();
    await chkbox.click();
    await page.click('[value="Purchase Flight"]');
    let successMSgTxt:string=await page.locator('div h1').innerText();
    expect(successMSgTxt).toEqual("Thank you for your purchase today!");
    await page.waitForTimeout(2000);




})