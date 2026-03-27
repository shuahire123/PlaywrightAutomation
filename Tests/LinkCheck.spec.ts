import { test, chromium } from "@playwright/test";
import ExcelJS from "exceljs";
import path from "path";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const INPUT_FILE  = path.join(__dirname, "urls.xlsx");
const OUTPUT_FILE = path.join(__dirname, "results.xlsx");
const URL_COLUMN  = "A";
const TARGET_URL  = "https://niim.com.au/";
const BATCH_SIZE  = 5;
const NAV_TIMEOUT = 60000;
// ──────────────────────────────────────────────────────────────────────────────

interface UrlEntry {
  rowNumber: number;
  url: string;
}

interface CheckResult {
  rowNumber: number;
  url: string;
  result: string;
  found: boolean;
  count: number;
}

// Count occurrences of TARGET_URL in full HTML
function countLinkOccurrences(html: string, target: string): number {
  const regex = new RegExp(
    target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "gi"
  );
  const matches = html.match(regex);
  return matches ? matches.length : 0;
}

async function readUrlsFromExcel(filePath: string): Promise<{
  workbook: ExcelJS.Workbook;
  sheet: ExcelJS.Worksheet;
  urls: UrlEntry[];
}> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];

  const urls: UrlEntry[] = [];

  sheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    const cellValue = row.getCell(URL_COLUMN).value;
    if (cellValue) {
      const url = cellValue.toString().trim();
      if (url && url.startsWith("http")) {
        urls.push({ rowNumber, url });
      }
    }
  });

  return { workbook, sheet, urls };
}

async function checkSingleUrl(context: any, entry: UrlEntry): Promise<CheckResult> {
  const { rowNumber, url } = entry;

  try {
    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });

    const html: string = await page.content();
    await page.close();

    const count = countLinkOccurrences(html, TARGET_URL);
    const found = count > 0;

    if (found) {
      console.log(`✅ FOUND (${count}) | ${url}`);
      return {
        rowNumber,
        url,
        result: `✅ Link Present (${count})`,
        found: true,
        count,
      };
    } else {
      console.log(`❌ NOT FOUND (0) | ${url}`);
      return {
        rowNumber,
        url,
        result: "❌ Link Not Present (0)",
        found: false,
        count: 0,
      };
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message.split("\n")[0] : String(err);
    console.log(`⚠️ ERROR | ${url} → ${message}`);
    return {
      rowNumber,
      url,
      result: `⚠️ ERROR: ${message}`,
      found: false,
      count: 0,
    };
  }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

test("Check each URL for niim.com.au link in full page source", async () => {

  console.log(`\n📂 Reading URLs from: ${INPUT_FILE}`);
  const { workbook, sheet, urls } = await readUrlsFromExcel(INPUT_FILE);

  if (urls.length === 0) {
    throw new Error("❌ No URLs found in Excel.");
  }

  console.log(`🔗 Total URLs to check : ${urls.length}`);
  console.log(`⚡ Batch size           : ${BATCH_SIZE}`);
  console.log(`⏱️ Timeout per page    : ${NAV_TIMEOUT / 1000}s`);
  console.log(`🎯 Looking for         : ${TARGET_URL}`);
  console.log("─".repeat(70));

  const headerCell = sheet.getCell("B1");
  headerCell.value = "niim.com.au Link Status";
  headerCell.font = { bold: true };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  });

  const batches = chunkArray(urls, BATCH_SIZE);
  const allResults: CheckResult[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`\n🚀 Batch ${i + 1}/${batches.length}`);

    const batchResults = await Promise.allSettled(
      batch.map((entry) => checkSingleUrl(context, entry))
    );

    for (const settled of batchResults) {
      if (settled.status === "fulfilled") {
        allResults.push(settled.value);
      }
    }
  }

  await browser.close();

  for (const { rowNumber, result } of allResults) {
    const cell = sheet.getCell(`B${rowNumber}`);
    cell.value = result;

    if (result.startsWith("✅")) {
      cell.font = { color: { argb: "FF006400" }, bold: true };
    }
    else if (result.startsWith("❌")) {
      cell.font = { color: { argb: "FFCC0000" } };
    }
    else if (result.startsWith("⚠️")) {
      cell.font = { color: { argb: "FFFF8C00" } };
    }
  }

  await workbook.xlsx.writeFile(OUTPUT_FILE);

  const foundUrls = allResults.filter((r) => r.found).map((r) => r.url);
  const totalCount = allResults.reduce((sum, r) => sum + r.count, 0);

  console.log("\n" + "─".repeat(70));
  console.log(`📊 SUMMARY`);
  console.log(`   Total checked        : ${urls.length}`);
  console.log(`   Link found on        : ${foundUrls.length} URL(s)`);
  console.log(`   Link not found       : ${urls.length - foundUrls.length} URL(s)`);
  console.log(`   Total occurrences    : ${totalCount}`);

  if (foundUrls.length > 0) {
    console.log("\n🔗 URLs containing link:");
    foundUrls.forEach((u, i) => console.log(`   ${i + 1}. ${u}`));
  }

  console.log(`\n📁 Results saved to: ${OUTPUT_FILE}\n`);
});