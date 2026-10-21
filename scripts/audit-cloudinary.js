import fs from 'fs';
import https from 'https';

const text = fs.readFileSync('frontend/src/data/products.js', 'utf8');
const clouds = [...text.matchAll(/res\.cloudinary\.com\/([^/]+)\//g)].map((m) => m[1]);
const counts = {};
for (const c of clouds) counts[c] = (counts[c] || 0) + 1;

const sampleUrl = (cloud) => {
  const m = text.match(new RegExp(`https://res\\.cloudinary\\.com/${cloud}/image/upload/[^'\"\\s]+`));
  return m?.[0] ?? null;
};

const fetchStatus = (url) =>
  new Promise((resolve) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (c) => {
          if (body.length < 120) body += c;
        });
        res.on('end', () => resolve({ status: res.statusCode, body: body.slice(0, 120) }));
      })
      .on('error', (e) => resolve({ status: 'ERR', body: e.message }));
  });

console.log('Cloud counts:', counts);
for (const cloud of Object.keys(counts).sort()) {
  const url = sampleUrl(cloud);
  if (!url) continue;
  const { status, body } = await fetchStatus(url);
  console.log(`\n${cloud}: ${counts[cloud]} refs, sample ${status}`);
  if (status !== 200) console.log(' ', body.replace(/\s+/g, ' ').trim());
}
