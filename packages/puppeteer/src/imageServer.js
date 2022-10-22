const { join, resolve, extname } = require("path");
const fs = require("fs");

const express = require("express");
const cors = require("cors");

const { shuffle } = require("./helpers");

const dateToString = (d) => d.toISOString().slice(0, 10);
const today = () => dateToString(new Date());
const MS_PER_DAY = 24 * 3600 * 1000;

const IMAGE_PATH = resolve(".", "..", "..", "screenshots");

function getImages(name, type, date, count) {
  const files = fs.readdirSync(join(IMAGE_PATH));
  let res = [];
  for (const f of files) {
    if (!/\d{4}-\d{2}-\d{2}/.test(f)) continue;
    getImagesByFolder(res, f, "done");
    getImagesByFolder(res, f, "anomalies");
  }
  if (name || type || date) {
    res = res.filter((d) => (!name || d.name === name) && (!type || d.type === type) && (!date || d.date === date));
  }
  //res.sort((d1, d2) => d1.changeTimestamp - d2.changeTimestamp);
  if (count > 0) {
    res = res.slice(0, count);
  }
  shuffle(res);
  return res;
}

function getImagesByFolder(res, date, folder) {
  const path = join(IMAGE_PATH, date, folder);
  if (!fs.existsSync(path)) return;
  const files = fs.readdirSync(path);
  const cutOff = Date.now() - MS_PER_DAY;
  for (const f of files) {
    const s = fs.statSync(join(path, f));
    const changeTimestamp = Math.floor(s.ctimeMs);
    // if (changeTimestamp < cutOff) continue;
    const ext = extname(f);
    if (!/\.(je?pg|png)/.test(ext)) continue;
    const m = f.match(/^([\.a-z0-9-]+)(_\d+)?\.(je?pg|png)$/);
    // if (!m) continue;
    if (!m) {
      console.log("no match");
    }
    const name = m[1];
    const index = m[2] ? m[2].slice(1) : null;
    res.push({ url: `./images/${date}/${folder}/${f}`, changeTimestamp, date, type: folder, name, index });
  }
}

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  const name = req.query.name ?? null;
  const type = req.query.type ?? null;
  const date = req.query.date ?? null;
  const count = req.query.count ?? 64;
  res.send(getImages(name, type, date, count));
});

app.use("/images", express.static(IMAGE_PATH));

app.listen(3000);
