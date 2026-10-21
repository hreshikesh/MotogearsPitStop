/**
 * Usage: node scripts/replace-cloudinary-cloud.mjs dbplgk8d8 dauynokmb
 * Updates frontend/src/data/products.js (run after assets exist on the target cloud).
 */
import fs from 'fs';

const [from, to] = process.argv.slice(2);
if (!from || !to) {
  console.error('Usage: node scripts/replace-cloudinary-cloud.mjs <fromCloud> <toCloud>');
  process.exit(1);
}

const path = 'frontend/src/data/products.js';
let text = fs.readFileSync(path, 'utf8');
const needle = `res.cloudinary.com/${from}/`;
const count = (text.match(new RegExp(needle.replace(/\//g, '\\/'), 'g')) || []).length;
if (!count) {
  console.log(`No URLs found for cloud "${from}".`);
  process.exit(0);
}

text = text.replaceAll(`res.cloudinary.com/${from}/`, `res.cloudinary.com/${to}/`);
fs.writeFileSync(path, text);
console.log(`Replaced ${count} URLs: ${from} -> ${to}`);
