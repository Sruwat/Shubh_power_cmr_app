import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const root = "C:\\Users\\shank\\Documents\\CRM\\shubh-power-360-platform";
const outDir = join(root, "docs", "evidence", "figma-reference");
const url = "https://fence-mug-17906901.figma.site/";
const port = 9333;

await mkdir(outDir, { recursive: true });

const chrome = spawn(chromePath, [
  `--remote-debugging-port=${port}`,
  "--user-data-dir=" + join(process.env.TEMP || ".", "shubh-figma-capture-profile"),
  "--no-first-run",
  "--no-default-browser-check",
  "--hide-scrollbars",
  "--window-size=393,873",
  "about:blank"
], { stdio: "ignore" });

async function waitJson(endpoint) {
  for (let i = 0; i < 80; i += 1) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) return await response.json();
    } catch {}
    await delay(250);
  }
  throw new Error(`Chrome did not expose ${endpoint}`);
}

await waitJson(`http://127.0.0.1:${port}/json/version`);
let pageTarget;
try {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  pageTarget = await response.json();
} catch {
  const targets = await waitJson(`http://127.0.0.1:${port}/json/list`);
  pageTarget = targets.find((target) => target.type === "page");
}
if (!pageTarget?.webSocketDebuggerUrl) {
  throw new Error("Could not create a Chrome page target for capture.");
}
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let seq = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
});

function cdp(method, params = {}) {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evalJs(expression) {
  const result = await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return result.result?.value;
}

async function screenshot(name) {
  await delay(700);
  const shot = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await writeFile(join(outDir, name), Buffer.from(shot.data, "base64"));
}

async function clickText(text) {
  return await evalJs(`(() => {
    const wanted = ${JSON.stringify(text.toLowerCase())};
    const candidates = [...document.querySelectorAll('button,a,[role="button"]')];
    const target = candidates.find((el) => (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().toLowerCase() === wanted)
      || candidates.find((el) => (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().toLowerCase().includes(wanted));
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  })()`);
}

await cdp("Page.enable");
await cdp("Runtime.enable");
await cdp("Emulation.setDeviceMetricsOverride", {
  width: 393,
  height: 873,
  deviceScaleFactor: 2,
  mobile: true
});
await cdp("Emulation.setUserAgentOverride", {
  userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36"
});
await cdp("Page.navigate", { url });
await delay(4000);

const captures = [];
async function record(name, action = null) {
  if (action) await action();
  await screenshot(name);
  const state = await evalJs(`(() => ({
    title: document.title,
    url: location.href,
    text: document.body.innerText.slice(0, 2500),
    buttons: [...document.querySelectorAll('button,a,[role="button"],input')]
      .map((el) => (el.innerText || el.value || el.getAttribute('aria-label') || el.placeholder || '').trim())
      .filter(Boolean)
      .slice(0, 80),
    viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }
  }))()`);
  captures.push({ file: name, ...state });
}

const navTargets = [
  ["01-splash.png", "Splash"],
  ["02-language.png", "Language"],
  ["03-login.png", "Login"],
  ["04-otp.png", "OTP"],
  ["05-location.png", "Location"],
  ["06-home.png", "List View"],
  ["07-map.png", "Map View"],
  ["08-search.png", "Search"],
  ["09-filters.png", "Filters"],
  ["10-station-detail.png", "Station Detail"],
  ["11-connector-selection.png", "Connector Select"],
  ["12-tariff-confirm.png", "Tariff Confirm"],
  ["13-active-session.png", "Live Session"],
  ["14-activity-wallet.png", "Wallet"],
  ["15-profile.png", "Profile"],
  ["16-history.png", "History"],
  ["17-saved.png", "Saved"],
  ["18-notifications.png", "Notifications"],
  ["19-support.png", "Support Home"],
  ["20-dark-home.png", "Dark Home"]
];

for (const [file, label] of navTargets) {
  await record(file, async () => {
    const clicked = await clickText(label);
    if (!clicked) console.warn(`Could not click navigator target: ${label}`);
    await delay(1000);
  });
}

await writeFile(join(outDir, "figma-capture-register.json"), JSON.stringify(captures, null, 2));
ws.close();
chrome.kill();
