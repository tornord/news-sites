const { join, resolve, extname } = require("path");
const fs = require("fs");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const dateToString = (d) => d.toISOString().slice(0, 10);
const today = () => dateToString(new Date());
const MS_PER_DAY = 24 * 3600 * 1000;

const IMAGE_PATH = resolve(".", "..", "..", "screenshots");
const VIEWER_DIST_PATH = resolve(".", "..", "viewer", "dist");
const PORT = 3000;

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

function getImages(name, type, date, count) {
  const files = fs.readdirSync(join(IMAGE_PATH));
  let res = [];
  for (const f of files) {
    if (!/\d{4}-\d{2}-\d{2}/.test(f)) continue;
    if (type !== "bin") {
      getImagesByFolder(res, f, "done");
      getImagesByFolder(res, f, "anomalies");
    } else {
      getImagesByFolder(res, f, "bin");
    }
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

const app = express();
app.use(cors());
app.use(bodyParser.json({ type: "application/json" }));

app.get("/search", (req, res) => {
  const name = req.query.name ?? null;
  const type = req.query.date !== "today" ? req.query.type ?? "done" : req.query.type ?? null;
  const date = req.query.date !== "today" ? req.query.date ?? null : dateToString(new Date());
  const count = req.query.count ?? 0;
  res.send(getImages(name, type, date, count));
});

app.post("/move", (req, res) => {
  const { url, folder } = req.body;
  if (!url || !folder || ["done", "anomalies", "bin"].findIndex((d) => d === folder) < 0) {
    res.sendStatus(400);
    return;
  }
  const m = url.match(/\/images\/(\d{4}-\d{2}-\d{2})\/([a-z0-9-]+)\/([\.a-z0-9_-]+\.jpg)$/);
  if (!m) {
    res.sendStatus(400);
    return;
  }
  console.log("move", url, folder, m);
  const [_, date, prevFolder, name] = m;
  const currPath = join(IMAGE_PATH, date, prevFolder, name);
  if (!fs.existsSync(currPath)) {
    res.sendStatus(400);
    return;
  }
  const newPath = join(IMAGE_PATH, date, folder);
  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath, { recursive: true });
  }
  fs.renameSync(currPath, join(newPath, name));
  res.sendStatus(200);
});

app.use("/images", express.static(IMAGE_PATH));

app.use("/admin", express.static(VIEWER_DIST_PATH));
app.use("/", express.static(VIEWER_DIST_PATH));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
