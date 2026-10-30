import { createHash } from 'node:crypto';
import { createReadStream, existsSync, statSync } from 'node:fs';

const parts = [
  'public/projects/bms/SeniorYearProject1.pdf.part-00',
  'public/projects/bms/SeniorYearProject1.pdf.part-01',
  'public/projects/bms/SeniorYearProject1.pdf.part-02',
  'public/projects/bms/SeniorYearProject1.pdf.part-03'
];
const expectedSize = 35194729;
const expectedGitBlob = '87a8548ea5e3f111d103bd817dfc32ca0fb64d28';
const size = parts.reduce((sum, path) => {
  if (!existsSync(path)) throw new Error(`Missing EE401 PDF segment: ${path}`);
  return sum + statSync(path).size;
}, 0);
if (size !== expectedSize) throw new Error(`EE401 PDF segments have unexpected size: ${size}`);
const hash = createHash('sha1').update(`blob ${size}\0`);
for (const path of parts) for await (const chunk of createReadStream(path)) hash.update(chunk);
const actual = hash.digest('hex');
if (actual !== expectedGitBlob) throw new Error(`EE401 PDF segments fail Git blob verification: ${actual}`);
console.log(`EE401 PDF segments verified (${size} bytes, ${actual}).`);
