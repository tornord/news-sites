const { join, resolve, extname } = require("path");
const fs = require("fs");

const Jimp = require("jimp");

function getDates(imagePath) {
  const files = fs.readdirSync(join(imagePath));
  const res = [];
  for (const f of files) {
    if (!/\d{4}-\d{2}-\d{2}/.test(f)) continue;
    res.push(f);
  }
  return res;
}

async function main() {
  const screenshotsPath = resolve(".", "screenshots");
  const thumbnailsPath = resolve(".", "thumbnails");
  const dates = getDates(screenshotsPath);
  const folders = ["done", "anomalies"];
  for (const date of dates) {
    for (const folder of folders) {
      const srcPath = join(screenshotsPath, date, folder);
      if (!fs.existsSync(srcPath)) continue;
      const destPath = join(thumbnailsPath, date, folder);
      const files = fs.readdirSync(srcPath);
      // if (fs.existsSync(join(srcPath, "images.raw"))) {
      //   fs.unlinkSync(join(srcPath, "images.raw"));
      // }
      // continue;
      for (const f of files) {
        const filename = join(srcPath, f);
        // const s = fs.statSync(filename);
        const ext = extname(f);
        if (!/\.(jpe?g|png)$/.test(ext)) continue;
        const outFilename = join(destPath, f.replace(/\.(jpe?g|png)$/, ".jpg"));
        if (fs.existsSync(outFilename)) continue;
        const img = await Jimp.read(filename);
        // console.log(f, img.bitmap);
        await img.resize(80, 120);
        await img.quality(80);
        await img.write(outFilename);
      }
      console.log(date, folder);
    }
  }
}

main();
