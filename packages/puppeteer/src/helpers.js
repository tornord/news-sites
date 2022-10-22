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

module.exports = { sleep, getShortUrl, shuffle };
