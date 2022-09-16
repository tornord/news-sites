const fs = require("fs");
const puppeteer = require("puppeteer");

const { sites } = require("./sites");
const { sleep, getShortUrl } = require("./helpers");
const { siteActions, iframeActions, defaultWidth, defaultDelay, defaultPostDelay } = require("./siteActions");

const dateToString = (d) => d.toISOString().slice(0, 10);
const today = () => dateToString(new Date());

function shuffle(array) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    const r = Math.floor(Math.random() * (n - 1 - i));
    const i1 = i + 1 + r;
    const t = array[i1];
    array[i1] = array[i];
    array[i] = t;
  }
  return array;
}

async function takeScreenshot(url, headless, id = null) {
  const date = today();
  const path = `./screenshots/${date}`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  const name = getShortUrl(url);
  const action = siteActions.find((d) => d.name === name);
  let width = defaultWidth;
  if (action && action.width) {
    width = action.width;
  }
  const aspectRatio = 59 / 41;
  // const aspectRatio = 16 / 9;
  const height = Math.round(aspectRatio * width); // 820 => 1180
  console.log(url, name, width);

  // https://gist.github.com/tegansnyder/c3aeae4d57768c58247ae6c4e5acd3d1
  // https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md
  // https://dev.to/sonyarianto/user-agent-string-difference-in-puppeteer-headless-and-headful-4aoh

  // console.log(await browser.userAgent());
  // browser.resize({ height, width });
  const browser = await puppeteer.launch({
    args: [
      `--window-size=${width},${height}`,
      "--disable-infobars",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
    ],
    headless,
  });
  try {
    // const page = await browser.newPage();
    const [page] = await browser.pages();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
    );

    await page.setDefaultNavigationTimeout(60000);
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
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
        log.map((d) => console.log(d));
      }
    }
    await sleep(500);
    // if (action?.waitForNavigation === true) {
    //   await page.waitForNavigation({ waitUntil: ["load", "networkidle2"] });
    // }
    // if (action?.scroll) {
    //   const frame = page.frames()?.[0];
    //   if (frame && !frame.isDetached()) {
    //     await frame.evaluate(({ scroll }) => {
    //       if (scroll) {
    //         window.scroll(...scroll);
    //       }
    //     }, action);
    //   }
    // }

    let postDelay = defaultPostDelay;
    if (action?.postDelay && action.postDelay > defaultPostDelay) {
      postDelay = action.postDelay;
    }
    await sleep(postDelay);

    await page.screenshot({
      path: `${path}/${name}${id !== null ? `_${String(id + 1).padStart(2, "0")}` : ""}.jpeg`,
      quality: 80,
    });
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

takeScreenshotAsync("https://www.nyteknik.se/", true, 1);
// takeScreenshotAsync("https://www.france24.com/en/", true, 1);
// takeScreenshotAsync("https://www.aftenposten.no/", true, 1);

// withoutActions();
// main();

// https://screenshotone.com/blog/puppeteer-execution-context-was-destroyed-most-likely-because-of-a-navigation/

//span[text()='Alle Akzeptieren']
//span[@type='close'][@role='button']
