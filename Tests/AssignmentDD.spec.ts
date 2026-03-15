import {test, expect,Locator} from '@playwright/test';
test('Assignment for Dropdown',async({page})=>
{
    await page.goto("https://www.bstackdemo.com/");
    let orderByDD:Locator = page.locator(".sort select");
    await orderByDD.isVisible();
    await orderByDD.isEnabled();
    await orderByDD.selectOption({value:'highestprice'});
    //Retrieve and Print Product Information
    let productPriceText:string[]=await page.locator('.val > b').allInnerTexts();
    let productNameText:string[]=await page.locator('.shelf-item__title').allInnerTexts();
    //compare size of product and price
    expect(productPriceText.length,"both array has same elements").toEqual(productNameText.length);
    let productName:string[]=productNameText.map((text)=>text.trim());
    let productPrice:number[]=productPriceText.map((price)=>Number(price.trim()));
   //print both Product name and product price
   /* for(let i=0;i<=productName.length-1;i++)
   {
    console.log(`product ${productName[i]} price ${productPrice[i]} `);
   } */
   //print lowest prce product name with price
   let productDetails= productName.map((name,index)=>({
    name:name,
    price:productPrice[index]
   }));
 for(let product of productDetails)
  {
    console.log(product);
  }
  let minPricePhone=productDetails.reduce((min,current)=>
  {
    return current.price<min.price ?current:min;
  });
  console.log(`minimum price phone name ${minPricePhone.name} price of phone ${minPricePhone.price}`);
  let maxPhonePrice=productDetails.reduce((max,current)=>
{
  return current.price>max.price ? current:max;
});
console.log(`maximum price phone name ${maxPhonePrice.name} price ${maxPhonePrice.price} `);
}
);