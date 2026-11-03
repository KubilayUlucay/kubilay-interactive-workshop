import { createHash } from 'node:crypto';
import { createReadStream, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicRoot = fileURLToPath(new URL('../public/', import.meta.url));
const manifest = JSON.parse(readFileSync(new URL('../src/publicReportPrivacy.json', import.meta.url), 'utf8'));
const evidence = JSON.parse(readFileSync(new URL('../src/projectEvidence.json', import.meta.url), 'utf8'));
if (manifest.version !== 1 || !Array.isArray(manifest.reports) || !manifest.reports.length) {
  throw new Error('Public reports require a reviewed privacy manifest.');
}
const reviewedPaths = new Set();
const reviewedReports = new Map();
for (const report of manifest.reports) {
  if (!report.files?.length || !/^[a-f0-9]{64}$/.test(report.sha256) || !Number.isInteger(report.pages) || report.pages < 1) {
    throw new Error('Invalid public report privacy record.');
  }
  const hash = createHash('sha256');
  let size = 0;
  for (const [index, file] of report.files.entries()) {
    if (!file.path.startsWith('projects/') || file.path.includes('..') || file.path.includes('\\') || reviewedPaths.has(file.path)) {
      throw new Error('Invalid or duplicate public report asset.');
    }
    reviewedPaths.add(file.path);
    const path = join(publicRoot, file.path);
    if (statSync(path).size !== file.size) throw new Error(`Reviewed report size changed: ${file.path}`);
    const fileHash = createHash('sha256');
    let firstChunk = true;
    for await (const chunk of createReadStream(path)) {
      if (index === 0 && firstChunk && chunk.subarray(0, 5).toString() !== '%PDF-') {
        throw new Error(`Reviewed report has an invalid PDF header: ${file.path}`);
      }
      firstChunk = false;
      fileHash.update(chunk);
      hash.update(chunk);
      size += chunk.length;
    }
    if (fileHash.digest('hex') !== file.sha256) throw new Error(`Report changed since privacy review: ${file.path}`);
  }
  if (size !== report.size || hash.digest('hex') !== report.sha256) throw new Error('Reviewed PDF reconstruction failed.');
  reviewedReports.set(report.files.map(file => '/' + file.path).join('|'), report);
}
const actualPaths = readdirSync(join(publicRoot, 'projects'), { recursive: true })
  .filter(path => /\.pdf(?:\.part-\d+)?$/i.test(path))
  .map(path => 'projects/' + path.split(sep).join('/'));
if (actualPaths.length !== reviewedPaths.size || actualPaths.some(path => !reviewedPaths.has(path))) {
  throw new Error('Unreviewed public PDF asset detected. Run the report privacy review before publishing.');
}
function verifyEvidence(value) {
  if (!value || typeof value !== 'object') return;
  if ('pages' in value && 'size' in value && 'sha256' in value) {
    const report = reviewedReports.get((value.parts || [value.src]).join('|'));
    if (!report || report.sha256 !== value.sha256 || report.size !== value.size || report.pages !== value.pages) {
      throw new Error('Report viewer metadata does not match the reviewed public PDF.');
    }
  }
  for (const entry of Object.values(value)) verifyEvidence(entry);
}
verifyEvidence(evidence);
const research = evidence['bms-research'];
if (!research?.redacted || research.parts?.length !== 4 || research.pages !== 80) {
  throw new Error('EE401 must retain four privacy-reviewed segments and all 80 pages.');
}
console.log(`Public report privacy hashes verified (${manifest.reports.length} PDFs, ${reviewedPaths.size} assets).`);
console.log(`Redacted EE401 PDF segments verified (${research.size} bytes, SHA-256 ${research.sha256}).`);
