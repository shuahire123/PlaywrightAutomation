import { test } from '@playwright/test';

test('Print table data', async ({ page }) => {

  await page.goto('https://testautomationpractice.blogspot.com/');

  const pages = page.locator('.pagination li');
  const pageCount = await pages.count();

  for (let p = 0; p < pageCount; p++) {

    await pages.nth(p).click();

    const rows = page.locator('#productTable tbody tr');
    const rowCount = await rows.count();

    console.log(`\n--- Page ${p + 1} ---`);

    for (let i = 0; i < rowCount; i++) {

      const row = rows.nth(i);
      const cols = row.locator('td');

      const id = await cols.nth(0).innerText();
      const name = await cols.nth(1).innerText();
      const price = await cols.nth(2).innerText();

      console.log(`ID: ${id}, Name: ${name}, Price: ${price}`);
    }
  }
});