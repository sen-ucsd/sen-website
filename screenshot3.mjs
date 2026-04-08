import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    errors.push(`[${msg.type()}] ${msg.text()}`);
  }
});

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

// Wait for loading animation to complete
await page.waitForTimeout(5000);

// Take hero screenshot
await page.screenshot({ path: "/tmp/v3-hero.png" });

// Scroll through the entire page to trigger whileInView animations
const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 300;
for (let y = 0; y < scrollHeight; y += step) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(100);
}

// Scroll back to top
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

// Now take full page screenshot with all animations triggered
await page.screenshot({ path: "/tmp/v3-fullpage.png", fullPage: true });

// Take individual section screenshots
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/v3-s1-hero.png" });

await page.evaluate(() => {
  document.getElementById("about")?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/v3-s2-about.png" });

await page.evaluate(() => {
  document.getElementById("programs")?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/v3-s3-programs.png" });

await page.evaluate(() => {
  document.getElementById("summit")?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/v3-s4-summit.png" });

await page.evaluate(() => {
  document.getElementById("community")?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/v3-s5-community.png" });

await page.evaluate(() => {
  document.getElementById("join")?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/v3-s6-join.png" });

console.log("Errors/warnings:", errors.length);
for (const e of errors) console.log(e);

await browser.close();
