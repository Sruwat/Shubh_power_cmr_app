const { chromium } = require('playwright');
(async () => {
  const outDir = 'C:/Users/shank/Documents/CRM/shubh-power-360-platform/docs/admin-dashboard-review';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto('https://studio-rich-50042713.figma.site/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.screenshot({ path: `${outDir}/desktop-full.png`, fullPage: true });
  const text = await page.locator('body').innerText({ timeout: 10000 }).catch(() => '');
  console.log(text.slice(0, 12000));
  await browser.close();
})();
