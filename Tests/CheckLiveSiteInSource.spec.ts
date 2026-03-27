import { test, chromium } from "@playwright/test";
import ExcelJS from "exceljs";
import path from "path";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const INPUT_FILE  = path.join(__dirname, "urls.xlsx");    // Input Excel file with URLs in column A
const OUTPUT_FILE = path.join(__dirname, "results.xlsx"); // Output Excel file with results in column B
const URL_COLUMN  = "A";                                  // Column where URLs are stored
const TARGET_URL  = "https://niim.com.au/";               // URL to search for anywhere in page source
const BATCH_SIZE  = 5;                                    // Number of URLs to process in parallel
const NAV_TIMEOUT = 60000;                                // 60 seconds timeout per page
// ──────────────────────────────────────────────────────────────────────────────

interface UrlEntry {
  rowNumber: number; // Excel row number (used to write result back to correct row)
  url: string;       // The URL to visit
}

interface CheckResult {
  rowNumber: number; // Excel row number
  url: string;       // The URL that was checked
  result: string;    // Result text to write into Excel
  found: boolean;    // Whether the link was found
}

/**
 * Checks if TARGET_URL exists ANYWHERE in the full page HTML source.
 * This includes:
 *   - <a href="..."> links in HTML
 *   - <script type="application/ld+json"> blocks
 *   - <script type="text/javascript"> blocks
 *   - Any inline JS, meta tags, comments, attributes — everything
 *
 * No stripping is done — the raw full HTML is searched directly.
 * Case-insensitive comparison is used so http vs HTTP etc. still matches.
 */
function isLinkPresentAnywhere(html: string, target: string): boolean {
  return html.toLowerCase().includes(target.toLowerCase());
}

/**
 * Reads URLs from column A of the Excel file.
 * Returns the workbook, the first worksheet, and the list of URL entries.
 */
async function readUrlsFromExcel(filePath: string): Promise<{
  workbook: ExcelJS.Workbook;
  sheet: ExcelJS.Worksheet;
  urls: UrlEntry[];
}> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);    // Load the Excel file from disk
  const sheet = workbook.worksheets[0];      // Use the first sheet

  const urls: UrlEntry[] = [];

  sheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    const cellValue = row.getCell(URL_COLUMN).value; // Read cell from column A
    if (cellValue) {
      const url = cellValue.toString().trim();         // Convert to string, trim whitespace
      if (url && url.startsWith("http")) {             // Only keep valid http(s) URLs
        urls.push({ rowNumber, url });
      }
    }
  });

  return { workbook, sheet, urls };
}

/**
 * Visits a single URL in its own browser page.
 * Gets the full HTML source and checks if TARGET_URL is present anywhere.
 * Closes the page after checking to free memory.
 * Never throws — all errors are caught and returned as a result object.
 */
async function checkSingleUrl(context: any, entry: UrlEntry): Promise<CheckResult> {
  const { rowNumber, url } = entry;

  try {
    // Open a new tab in the shared browser context
    const page = await context.newPage();

    // Navigate to the URL — wait only for DOM to load, not images/fonts/etc.
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT,
    });

    // Get the complete raw HTML source of the page (includes all script tags)
    const html: string = await page.content();

    // Close the tab immediately after getting HTML to free memory
    await page.close();

    // Check if TARGET_URL is present anywhere in the full HTML source
    const found = isLinkPresentAnywhere(html, TARGET_URL);

    if (found) {
      console.log(`✅ LINK FOUND  | ${url}`);
      return { rowNumber, url, result: "✅ Link Present", found: true };
    } else {
      console.log(`❌ NOT FOUND   | ${url}`);
      return { rowNumber, url, result: "❌ Link Not Present", found: false };
    }

  } catch (err: unknown) {
    // Catch timeout, DNS errors, SSL errors, etc.
    const message = err instanceof Error ? err.message.split("\n")[0] : String(err);
    console.log(`⚠️  ERROR       | ${url} → ${message}`);
    return { rowNumber, url, result: `⚠️ ERROR: ${message}`, found: false };
  }
}

/**
 * Splits an array into chunks of a given size.
 * e.g. chunkArray([1,2,3,4,5,6,7], 3) → [[1,2,3],[4,5,6],[7]]
 */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ─── PLAYWRIGHT TEST ──────────────────────────────────────────────────────────

test("Check each URL for niim.com.au link in full page source", async () => {

  // ── Step 1: Read all URLs from Excel ──────────────────────────────────────
  console.log(`\n📂 Reading URLs from: ${INPUT_FILE}`);
  const { workbook, sheet, urls } = await readUrlsFromExcel(INPUT_FILE);

  if (urls.length === 0) {
    throw new Error("❌ No URLs found in Excel. Make sure column A has URLs starting with http.");
  }

  console.log(`🔗 Total URLs to check : ${urls.length}`);
  console.log(`⚡ Batch size           : ${BATCH_SIZE} URLs at a time`);
  console.log(`⏱️  Timeout per page    : ${NAV_TIMEOUT / 1000}s`);
  console.log(`🎯 Looking for         : ${TARGET_URL}`);
  console.log(`🔍 Searching           : Full page source (HTML + all script tags)\n`);
  console.log("─".repeat(70));

  // ── Step 2: Write bold header to column B ─────────────────────────────────
  const headerCell = sheet.getCell("B1");
  headerCell.value = "niim.com.au Link Status";
  headerCell.font = { bold: true };

  // ── Step 3: Launch browser and create a shared context ────────────────────
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  });

  // ── Step 4: Split URLs into batches and process in parallel ───────────────
  const batches = chunkArray(urls, BATCH_SIZE);
  const allResults: CheckResult[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`\n🚀 Batch ${i + 1}/${batches.length} — checking ${batch.length} URLs in parallel...`);

    // Run all URLs in this batch simultaneously
    // Promise.allSettled waits for ALL to finish even if some fail
    const batchResults = await Promise.allSettled(
      batch.map((entry) => checkSingleUrl(context, entry))
    );

    // Collect results — checkSingleUrl never rejects so all will be "fulfilled"
    for (const settled of batchResults) {
      if (settled.status === "fulfilled") {
        allResults.push(settled.value);
      }
    }
  }

  // ── Step 5: Close browser after all batches complete ──────────────────────
  await browser.close();

  // ── Step 6: Write all results to column B in Excel ────────────────────────
  for (const { rowNumber, result } of allResults) {
    const cell = sheet.getCell(`B${rowNumber}`);
    cell.value = result;

    // Green bold for found
    if (result.startsWith("✅")) {
      cell.font = { color: { argb: "FF006400" }, bold: true };
    }
    // Red for not found
    else if (result.startsWith("❌")) {
      cell.font = { color: { argb: "FFCC0000" } };
    }
    // Orange for errors
    else if (result.startsWith("⚠️")) {
      cell.font = { color: { argb: "FFFF8C00" } };
    }
  }

  // ── Step 7: Save the Excel file ───────────────────────────────────────────
  await workbook.xlsx.writeFile(OUTPUT_FILE);

  // ── Step 8: Print final summary ───────────────────────────────────────────
  const foundUrls = allResults.filter((r) => r.found).map((r) => r.url);

  console.log("\n" + "─".repeat(70));
  console.log(`\n📊 SUMMARY`);
  console.log(`   Total checked  : ${urls.length}`);
  console.log(`   Link found on  : ${foundUrls.length} URL(s)`);
  console.log(`   Link not found : ${urls.length - foundUrls.length} URL(s)\n`);

  if (foundUrls.length > 0) {
    console.log("🔗 URLs that contain niim.com.au link (anywhere in page source):");
    foundUrls.forEach((u, i) => console.log(`   ${i + 1}. ${u}`));
  } else {
    console.log("ℹ️  No URLs contained the niim.com.au link anywhere in the page source.");
  }

  console.log(`\n📁 Results saved to: ${OUTPUT_FILE}\n`);
});