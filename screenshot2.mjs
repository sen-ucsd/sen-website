import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Collect all console messages
const logs = [];
page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => logs.push(`[PAGE ERROR] ${err.message}`));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

// Wait for loading to fully finish
await page.waitForTimeout(5000);

// Full page screenshot
await page.screenshot({ path: "/tmp/sen-full-v2.png", fullPage: true });

// Check for the Next.js error indicator
const errorBadge = await page.evaluate(() => {
  // Next.js dev overlay indicator
  const indicator = document.querySelector('[data-nextjs-toast]');
  if (indicator) return indicator.textContent;
  // Also check for any shadow DOM indicators
  const all = document.querySelectorAll('nextjs-portal');
  if (all.length) {
    const portal = all[0];
    if (portal.shadowRoot) {
      const toast = portal.shadowRoot.querySelector('[data-nextjs-toast]');
      if (toast) return toast.textContent;
    }
  }
  return "no error badge found";
});

console.log("Error badge:", errorBadge);
console.log("\nConsole logs:");
for (const l of logs.filter(l => l.includes("ERROR") || l.includes("error") || l.includes("warn"))) {
  console.log(l);
}

// Also check all console messages
console.log("\nAll console messages:");
for (const l of logs) {
  console.log(l);
}

await browser.close();
