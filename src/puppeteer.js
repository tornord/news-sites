const fs = require("fs");
const { join, resolve, extname } = require("path");
const puppeteer = require("puppeteer");
const { createHash } = require("crypto");

const { sites } = require("./sites");
const { sleep, getShortUrl, shuffle } = require("./helpers");
const { siteActions, iframeActions, defaultWidth, defaultDelay, defaultPostDelay } = require("./siteActions");

const dateToString = (d) => d.toISOString().slice(0, 10);
const today = () => dateToString(new Date());

function sha256(str) {
  return createHash("sha256").update(str).digest("hex");
}

function getFilename(path, name, id) {
  let res;
  while (true) {
    res = `${name}${id !== null ? `_${String(id + 1).padStart(2, "0")}` : ""}.jpg`;
    if (!fs.existsSync(`${path}/done/${res}`) && !fs.existsSync(`${path}/anomalies/${res}`)) break;
    id = id === null ? 0 : id + 1;
  }
  return `${path}/${res}`;
}

async function takeScreenshot(url, headless, id = null) {
  const date = today();
  const path = `./screenshots/${date}`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  if (!fs.existsSync(join(path, "done"))) {
    fs.mkdirSync(join(path, "done"), { recursive: true });
  }
  if (!fs.existsSync(join(path, "anomalies"))) {
    fs.mkdirSync(join(path, "anomalies"), { recursive: true });
  }
  const name = getShortUrl(url);
  const action = siteActions.find((d) => d.name === name);
  let width = defaultWidth;
  if (action && action.width) {
    width = action.width;
  }
  const aspectRatio = 59 / 41;
  // const aspectRatio = 16 / 9;
  // const aspectRatio = 2;
  const height = Math.round(aspectRatio * width); // 820 => 1180
  console.log(url, name, width);

  // console.log(await browser.userAgent());
  // browser.resize({ height, width });
  const browser = await puppeteer.launch({
    args: [
      `--window-size=${width},${height}`,
      "--disable-infobars",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--disable-web-security",
      "--disable-features=IsolateOrigins",
      "--disable-site-isolation-trials",
    ],
    headless,
    defaultViewport: null,
  });
  try {
    // const page = await browser.newPage();
    const [page] = await browser.pages();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      // "sec-ch-ua": '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
      // "sec-ch-ua-platform": "macOS",
      // "sec-ch-ua-mobile": "?0",
      // pragma: "no-cache",
    });
    await page.setDefaultNavigationTimeout(60000);
    await page.setViewport({ width, height, deviceScaleFactor: 0.5 });
    // const result = await page.evaluate(() => {
    //   return {
    //     width: document.documentElement.clientWidth,
    //     height: document.documentElement.clientHeight,
    //     deviceScaleFactor: window.devicePixelRatio,
    //   };
    // });
    // console.log("result", result);
    if (action && action.cookies && action.cookies.length > 0) {
      await page.setCookie(...action.cookies);
    }
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const t0 = Date.now();
    let delay = defaultDelay;
    if (action?.delay > defaultDelay) {
      delay = action.delay;
    }
    let retryCount = 1;
    if (action?.retryCount) {
      retryCount = action.retryCount;
    }
    for (let i = 0; i < retryCount; i++) {
      await sleep(delay);
      if (i > 0) {
        console.log("retry", Date.now() - t0, i + 1);
      }
      const frames = page.frames();
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (frame.isDetached() || frame.url() === "about:blank") continue;
        // console.log("before", i, frame.url());
        // const { origin, isIFrame } = await frame.evaluate(() => {
        //   const isIFrame = window !== window.parent;
        //   return { origin: window.origin, isIFrame };
        // });
        // const shortOrigin = getShortUrl(origin);
        const shortOrigin = getShortUrl(frame.url());
        // console.log("after", i, frame.url(), origin, isIFrame);

        // const actions = isIFrame ? iframeActions : siteActions;
        const actions = i > 0 ? iframeActions : siteActions;
        const a = actions.find((d) => d.name === shortOrigin);
        if (!a) continue;
        if (!a.clicks && !a.removes && !a.styles && !a.scroll) continue;
        if (frame.isDetached()) continue;
        const log = await frame.evaluate(
          ({ action, t0 }) => {
            const { name, clicks, removes, styles } = action;
            const evaluateXPath = (expression) => {
              let doc = document;
              let ds = expression.split(" | ");
              if (ds.length === 2) {
                const n = document.evaluate(
                  ds[0],
                  doc,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                )?.singleNodeValue;
                if (n && n.contentDocument) {
                  doc = n.contentDocument;
                  expression = ds[1];
                }
              }
              const nodes = document.evaluate(expression, doc, null, XPathResult.ANY_TYPE, null);
              const results = [];
              let node;
              while ((node = nodes.iterateNext())) {
                results.push(node);
              }
              return results;
            };
            const log = [];
            const console = { log: (...args) => log.push(args.join(" ")) };
            if (clicks) {
              for (let x of clicks) {
                const res = evaluateXPath(x);
                if (res.length === 0) {
                  console.log("click actions, no match", Date.now() - t0, name, x);
                }
                for (const r of res) {
                  console.log("click", Date.now() - t0, name, x, r);
                  r.click();
                }
              }
            }
            if (removes) {
              for (const x of removes) {
                const res = evaluateXPath(x);
                if (res.length === 0) {
                  console.log("remove actions, no match", Date.now() - t0, name, x);
                }
                for (const r of res) {
                  console.log("remove", Date.now() - t0, name, x, r);
                  r.remove();
                }
              }
            }
            if (styles) {
              for (const x of styles) {
                const res = evaluateXPath(x.xpath);
                if (res.length === 0) {
                  console.log("styles actions, no match", Date.now() - t0, name, x);
                }
                for (const r of res) {
                  console.log(
                    "styles",
                    Date.now() - t0,
                    name,
                    Object.entries(x.value)
                      .map(([k, v]) => `${k}: ${v};`)
                      .join(" "),
                    r
                  );
                  for (const [k, v] of Object.entries(x.value)) {
                    r.style[k] = v;
                  }
                }
              }
            }
            return log;
          },
          { action: a, t0 }
        );
        log.map((d) => console.log(`${shortOrigin} ${d}`));
      }
    }
    await sleep(500);
    if (action?.scrolls) {
      for (const d of action?.scrolls) {
        await page.evaluate((y) => {
          window.scrollTo(0, y);
        }, d);
        await sleep(500);
      }
    }
    let postDelay = defaultPostDelay;
    if (action?.postDelay && action.postDelay > defaultPostDelay) {
      postDelay = action.postDelay;
    }
    await sleep(postDelay);
    const filename = getFilename(path, name, id);
    await page.screenshot({ path: filename, quality: 80, captureBeyondViewport: false }); // fromSurface: false, // headful only
    console.log("done!", Date.now() - t0);
  } catch (error) {
    const errorPath = `${path}/errors`;
    if (!fs.existsSync(errorPath)) {
      fs.mkdirSync(errorPath, { recursive: true });
    }
    const errorText = [`${error.message}`, `${error.stack}`].join("\n");
    console.log(errorText);
    fs.writeFileSync(`${errorPath}/${name}.txt`, errorText, "utf-8");
  } finally {
    await browser.close();
  }
}

function getJpgFiles(path) {
  if (!fs.existsSync(path)) return [];
  const files = fs.readdirSync(path);
  const res = [];
  for (const f of files) {
    const ext = extname(f);
    if (!/\.jpg/.test(ext)) continue;
    res.push(join(path, f));
  }
  return res;
}

async function imageFileStats() {
  const imagePath = resolve(".", "screenshots");
  const files = fs.readdirSync(imagePath);
  const dones = [];
  const anomalies = [];
  for (const f of files) {
    const s = fs.lstatSync(join(imagePath, f));
    if (!s || !s.isDirectory()) continue;
    if (!/\d{4}-\d{2}-\d{2}/.test(f)) continue;
    const fds = getJpgFiles(join(imagePath, f, "done"));
    dones.push(...fds);
    const fas = getJpgFiles(join(imagePath, f, "anomalies"));
    anomalies.push(...fas);
  }
  console.log("done:", dones.length);
  console.log("anomalies:", anomalies.length);
}

async function main() {
  const arr = sites.map((_, i) => i);
  shuffle(arr);
  for (const i of arr) {
    const { url } = sites[i];
    await takeScreenshot(url, true);
  }
}

async function takeScreenshotAsync(url, headless, count = 1) {
  for (let i = 0; i < count; i++) {
    await takeScreenshot(url, headless, count > 1 ? i : null);
  }
}

async function withoutActions() {
  const arr = sites.map((_, i) => i);
  shuffle(arr);
  while (siteActions.length > 0) {
    siteActions.pop();
  }
  while (iframeActions.length > 0) {
    iframeActions.pop();
  }
  for (const i of arr) {
    const { url } = sites[i];
    await takeScreenshot(url, true);
  }
}

// console.log(sites.length);
takeScreenshotAsync("https://www.gazzetta.it/", true, 1);

// (async () => {
//   await takeScreenshotAsync("https://www.lastampa.it/", true, 1);
//   await takeScreenshotAsync("https://www.nyteknik.se/", true, 1);
//   await takeScreenshotAsync("https://www.telegraaf.nl/", true, 1);
// })();

// withoutActions();
// main();
// imageFileStats();

// Documentation
// https://devdocs.io/puppeteer/
// https://chromedevtools.github.io/devtools-protocol/tot/Network/
// https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-captureScreenshot

// https://stackoverflow.com/questions/68059664/puppeteer-page-screenshot-resizes-viewport

// https://gist.github.com/tegansnyder/c3aeae4d57768c58247ae6c4e5acd3d1
// https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md
// https://dev.to/sonyarianto/user-agent-string-difference-in-puppeteer-headless-and-headful-4aoh

// https://screenshotone.com/blog/puppeteer-execution-context-was-destroyed-most-likely-because-of-a-navigation/

// https://github.com/puppeteer/puppeteer/issues/511
// const client = await page.target().createCDPSession();
// await client.send("Animation.setPlaybackRate", { playbackRate: 0.0 });
// await client.send("Animation.disable");

// https://stackoverflow.com/questions/61647401/puppeteer-does-not-change-selector
// await page.addStyleTag({
//   content: `
//     *,
//     *::after,
//     *::before {
//         transition-delay: 0s !important;
//         transition-duration: 0s !important;
//         animation-delay: -0.0001s !important;
//         animation-duration: 0s !important;
//         animation-play-state: paused !important;
//         caret-color: transparent !important;
// }`,
// });

// https://stackoverflow.com/questions/52129649/puppeteer-cors-mistake
// https://splunktool.com/puppeteer-cors-mistake
// --disable-web-security
// --disable-features=IsolateOrigins
// --disable-site-isolation-trials

// https://stackoverflow.com/questions/63061911/how-do-i-set-multiple-custom-http-headers-in-puppeteer
// await page.setRequestInterception(true);
// page.on("request", (request) => {
//   const headers = request.headers();
//   headers["X-Just-Must-Be-Request-In-All-Requests"] = "1";
//   request.continue({
//     headers,
//   });
// });
//
// await page.setExtraHTTPHeaders({
//   "user-agent":
//     "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
//   "upgrade-insecure-requests": "1",
//   accept:
//     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
//   "accept-encoding": "gzip, deflate, br",
//   "accept-language": "en-US,en;q=0.9,en;q=0.8",
// });
// await page.goto("...");
