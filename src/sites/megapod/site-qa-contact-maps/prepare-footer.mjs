import fs from 'node:fs';

const [baselinePath, outputPath] = process.argv.slice(2);
if (!baselinePath || !outputPath) throw new Error('Usage: node prepare-footer.mjs <scoped-footer.json> <writes.json>');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const item = baseline.items[0];
if (baseline.items.length !== 1 || item.itemType !== 'global-section' || item.itemKey !== 'design-main-layout-footer') throw new Error('Expected only the current global footer.');
const oldURL = 'https://www.mastercard.com/rs/consumer/credit-cards.html';
const newURL = 'https://www.mastercard.com/rs/sr/biznis/cybersecurity-fraud-prevention/identity/authentication.html';
const serialized = JSON.stringify(item.definition);
if (serialized.split(oldURL).length !== 2) throw new Error('Expected exactly one obsolete Mastercard link.');
const definition = JSON.parse(serialized.replace(oldURL, newURL));
fs.writeFileSync(outputPath, JSON.stringify({siteKey:baseline.siteKey,expectedSnapshotHash:baseline.snapshotHash,writes:[{itemType:item.itemType,itemKey:item.itemKey,expectedRevision:item.draftRevision,definition}]}, null, 2) + '\n');
console.log('Prepared one verified Mastercard destination correction.');
