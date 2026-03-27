import { test } from '@playwright/test';
import XLSX from 'xlsx';
import path from 'path';
import * as ExcelJS from 'exceljs';

interface Row {
  URL?: string;
}

const filePath = path.join(__dirname, 'urls.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json<Row>(sheet);

const firstRow = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[];
const urlColIndex = firstRow.findIndex(h => h === 'URL') + 1;
const resultColIndex = urlColIndex + 1;

const BATCH_SIZE = 5;
const NAV_TIMEOUT = 20000; // 20s per URL max

test('Check forms and write results to Excel', async ({ browser }) => {
  test.setTimeout(300000); // 5 min total for all URLs

  const excelWorkbook = new ExcelJS.Workbook();
  await excelWorkbook.xlsx.readFile(filePath);
  const excelSheet = excelWorkbook.worksheets[0];

  excelSheet.getCell(1, resultColIndex).value = 'Has Form?';
  excelSheet.getCell(1, resultColIndex).font = { bold: true };

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);

    await Promise.allSettled(
      batch.map(async (row, batchIndex) => {
        const url = row.URL;
        const excelRow = i + batchIndex + 2;

        if (!url) return;

        const context = await browser.newContext();
        const page = await context.newPage();

        let hasForm = false;
        let status = '';

        try {
          await page.goto(url, { timeout: NAV_TIMEOUT, waitUntil: 'domcontentloaded' });
          //const formCount = await page.locator('.niim-enquiry-form').count();
          const formCount = await page.locator('.niim-CTF').count();
          hasForm = formCount > 0;
          status = hasForm ? '✅ Form' : '❌ No Form';
        } catch (e: any) {
          status = `⚠️ Timeout/Error`;
          hasForm = false;
        } finally {
          await context.close();
        }

        console.log(`${status} - ${url}`);

        const cell = excelSheet.getCell(excelRow, resultColIndex);
        cell.value = hasForm ? 'Yes' : 'No';
        cell.font = {
          color: { argb: hasForm ? 'FF008000' : 'FFFF0000' },
          bold: true,
        };
      })
    );

    console.log(`📦 Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(data.length / BATCH_SIZE)} done`);
  }

  await excelWorkbook.xlsx.writeFile(filePath);
  console.log('✅ Results written to urls.xlsx');
});