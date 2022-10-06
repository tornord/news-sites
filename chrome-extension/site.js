// https://github.com/GoogleChrome/chrome-extensions-samples
// var db = JSON.parse(window.localStorage.getItem("db"));

function evaluateXPath(expression) {
  let doc = document;
  let ds = expression.split(" | ");
  if (ds.length === 2) {
    const n = document.evaluate(ds[0], doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)?.singleNodeValue;
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
}
window.evaluateXPath = evaluateXPath;

window.onload = () => {
  const t0 = Date.now();
  const isIFrame = window !== window.parent;
  // window.localStorage.setItem("db", JSON.stringify(db));
  const m = window.origin.match(/^https:\/\/(?:www\.)?([a-z0-9\.-]+)(?:\/.+)*\/?$/);
  console.log("onload", m?.[1], isIFrame);
  if (!m?.[1]) return;
  const name = m[1];
  const actions = isIFrame ? iframeActions : siteActions;
  const a = actions.find((d) => d.name === name);
  if (!a) return;
  console.log("onload", name, isIFrame);
  const { clicks, removes, styles, scroll } = a;
  if (!clicks && !removes && !scroll) return;
  let { delay } = a;
  delay ??= 2500;
  let retryCount = 1;
  if (a.retryCount) {
    retryCount = a.retryCount;
  }
  let intervalIndex = 0;
  const intervalID = setInterval(() => {
    if (intervalIndex > 0) {
      console.log("retry", intervalIndex + 1, Date.now() - t0);
    }
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
    intervalIndex++;
    if (intervalIndex >= retryCount) {
      window.clearInterval(intervalID);
      if (scroll || styles) {
        setTimeout(() => {
          if (scroll) {
            console.log("scroll action", name, scroll);
            window.scroll(...scroll);
          }
          if (styles) {
            for (const x of styles) {
              const res = evaluateXPath(x.xpath);
              if (res.length === 0) {
                console.log("styles actions, no match", name, x);
              }
              for (const r of res) {
                console.log("styles", name, x.value, r);
                for (const [k, v] of Object.entries(x.value)) {
                  r.style[k] = v;
                }
              }
            }
          }
        }, 500);
      }
    }
  }, delay);
};

window.addEventListener("scroll", (event) => {
  let scroll = this.scrollY;
  // console.log("scroll", scroll);
});
