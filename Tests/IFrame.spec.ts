import { test, expect, Frame } from '@playwright/test';

test('Practice iFrame', async ({ page }) => {
    await page.goto("https://www.tutorialspoint.com/selenium/practice/frames.php");

    // Interact with iframe using modern frameLocator API
    const frameLocator = page.frameLocator("[src='new-tab-sample.php']").first();
    const logo = frameLocator.locator(".logo-desktop");
    await expect(logo).toBeVisible();

    // Log all frames and their children using legacy frames() API
    const allFrames: Array<Frame> = page.frames();
    for (const frame of allFrames) {
        const frameName: string = frame.name();
        console.log("Frame:", frameName);

        if (frame.childFrames().length > 0) {  //
            for (const subFrame of frame.childFrames()) {
                const subFrameName: string = subFrame.name();
                console.log("  Sub-frame:", subFrameName);  // 
            }
        }
    }
});