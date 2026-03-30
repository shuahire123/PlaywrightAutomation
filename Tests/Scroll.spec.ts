import { test, expect } from '@playwright/test';

test("scroll and find all number of books available in the page", async ({ page }) => {
    await page.goto("https://www.booksbykilo.in/new-books?pricerange=201to500");

    let previousHeight = 0;

    while (true) {
        const currentHeight = await page.evaluate(() => document.body.scrollHeight);

        if (previousHeight === currentHeight) {
            break; // No new content loaded — we've reached the bottom
        }

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Wait for new books to load after scroll
        await page.waitForTimeout(5000);

        previousHeight = currentHeight;
    }

    // Count all books AFTER full scroll — avoids duplicates
    const totalNumberOfBooks = (await page.locator("#productsDiv h3").all()).length;

    console.log(`Total books found: ${totalNumberOfBooks}`);
    expect(totalNumberOfBooks).toBeGreaterThan(0);
});