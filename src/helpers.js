const { siteActions, iframeActions, defaultWidth, defaultDelay } = require("./siteActions");

const getShortUrl = (url) => {
  const m = url.match(/^https:\/\/(?:www\.)?([a-z0-9\.-]+)(?:\/.+)*\/?$/);
  if (m) return m[1];
  return null;
};

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

module.exports = { sleep, getShortUrl };
