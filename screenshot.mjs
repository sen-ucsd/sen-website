import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

// Wait for loading screen to appear and animate
await page.waitForTimeout(1000);
await page.screenshot({ path: "/tmp/sen-loading.png", fullPage: false });

// Wait for loading to finish
await page.waitForTimeout(3500);
await page.screenshot({ path: "/tmp/sen-hero.png", fullPage: false });

// Check console errors
const errors = [];
page.on("pageerror", (err) => errors.push(err.message));

// Full page screenshot
await page.screenshot({ path: "/tmp/sen-fullpage.png", fullPage: true });

// Scroll down and take section shots
await page.evaluate(() => window.scrollTo(0, window.innerHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/sen-about.png", fullPage: false });

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/sen-programs.png", fullPage: false });

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/sen-summit.png", fullPage: false });

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 4));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/sen-community.png", fullPage: false });

// Get console errors
const consoleErrors = await page.evaluate(() => {
  // Check if there are visible error overlays
  const errorOverlay = document.querySelector("[data-nextjs-dialog]");
  return errorOverlay ? errorOverlay.textContent : "no error overlay";
});

console.log("Console errors:", errors.length ? errors.join("\n") : "none");
console.log("Error overlay:", consoleErrors);

await browser.close();
