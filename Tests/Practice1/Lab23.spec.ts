// Import required modules from Playwright
// test -> used to create test cases
// expect -> used for assertions/validations
// Locator -> used for defining element locators
import { test, expect, Locator } from '@playwright/test';

// Test case: Verify Product Sorting and Information Retrieval
test('Verify Product Sorting and Information Retrieval', async ({ page }) => {

    // Step 1: Navigate to the application URL
    await page.goto('https://www.bstackdemo.com/');

    // Step 2: Locate the "Order by" dropdown element
    // .sort select is the locator for the sorting dropdown
    let orderByDD: Locator = page.locator('.sort select');

    // Verify the dropdown is visible on the page
    await expect(orderByDD).toBeVisible();

    // Verify the dropdown is enabled and user can interact with it
    await expect(orderByDD).toBeEnabled();

    // Select "Lowest to highest" option from the dropdown
    await orderByDD.selectOption({ label: 'Lowest to highest' });


    // Step 3: Retrieve product information

    // Get all product names from the page
    // allInnerTexts() returns array of strings
    let NameOfProduct: string[] =
        await page.locator('.shelf-item__title').allInnerTexts();

    // Get all product prices from the page
    // allTextContents() returns array of strings
    let PriceOfProduct: string[] =
        await page.locator('.shelf-item__price > .val > b').allTextContents();

    // Verify product names count is equal to product prices count
    await expect(NameOfProduct.length).toBe(PriceOfProduct.length);

    // Combine product name and price into a single object array
    // Convert price from string to number
    let products: { name: string, price: number }[] =
        NameOfProduct.map((value, index) => ({
            name: value,
            price: Number(PriceOfProduct[index])
        }));

    // Print each product name with its price in console
    console.log("List of Products with Price:");
    products.forEach((product) => {
        console.log(`Product Name: ${product.name} | Price: ${product.price}`);
    });


    // Step 4: Identify the Lowest Priced Product

    // Find the lowest price using reduce()
    let lowestPrice: number = products.reduce((acc, value) => {
        return value.price < acc ? value.price : acc;
    }, products[0].price);

    // Find the product object which contains the lowest price
    let lowestPriceProduct = products.find((product) => {
        if (product.price === lowestPrice) {
            return { name: product.name, price: product.price };
        }
    });

    // Print lowest priced product
    console.log("Lowest Price Product:");
    console.log(lowestPriceProduct);


    // Step 5: Identify the Highest Priced Product

    // Since sorting is already "Lowest to highest",
    // the last product in the array will be the highest priced product
    let highestPriceProduct = products[products.length - 1];

    // Print highest priced product
    console.log("Highest Price Product:");
    console.log(highestPriceProduct);

});