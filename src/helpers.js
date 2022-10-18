const { siteActions, iframeActions, defaultWidth, defaultDelay } = require("./siteActions");

const getShortUrl = (url) => {
  const m = url.match(/^https:\/\/(?:www\.)?([a-z0-9\.-]+)(?:\/.+)*\/?$/);
  if (m) return m[1];
  return null;
};

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

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

async function handleFrame(frame, shortOrigin, pageState, action, delay, retryCount) {
  for (let i = 0; i < retryCount; i++) {
    await sleep(delay);
    if (frame.isDetached()) return;
    if (pageState.snapshotTaken) return;
    if (i > 0) {
      console.log("retry", i + 1, Date.now() - pageState.t0);
    }
    const log = await frame.evaluate(
      ({ action, t0 }) => {
        const { name, clicks, removes, styles } = action;
        const evaluateXPath = (expression) => {
          let doc = document;
          let ds = expression.split(" | ");
          if (ds.length === 2) {
            const fo = XPathResult.FIRST_ORDERED_NODE_TYPE;
            const n = document.evaluate(ds[0], doc, null, fo, null)?.singleNodeValue;
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
      { action: action, t0: pageState.t0 }
    );
    log.map((d) => console.log(`${shortOrigin} ${d}`));
  }
  pageState.frames[shortOrigin] = true;
}

module.exports = { sleep, getShortUrl, shuffle, handleFrame };
