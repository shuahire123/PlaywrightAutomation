import { test, expect } from '@playwright/test';

test('docket creation flow automation', async ({ page }) => {

  await page.goto('https://v7dev.loscamonline.com');

  await page.locator('#username').fill('npw.dev2@loscam.au');
  await page.getByText('Continue', { exact: true }).click();

  await page.locator('input.button.button-primary').click();
  await page.locator('#input60').fill('T9ya^8,M0R4v^,9');
  await page.locator('.button.button-primary').click();

  await page.locator("xpath=//label[@class='transaction-Link']/parent::a").click();
  page.waitForTimeout(5000);
  await page.locator("//span[contains(text(),'DEV3 DC TO DC DISPATCH OFF')]/parent::a").click();

  await page.getByRole('button', { name: 'Manual Entry' }).click();

  await page.locator('#transaction_docket_number').fill('AB123456789');
  await page.locator('#transaction_reference').fill('Test Reference');

  await expect(page.locator('#transaction_sending_team_member')).toBeDisabled();

  await expect(page.locator('#transaction_receiving_team_member'))
    .toHaveValue('NPW DEV 2');
});