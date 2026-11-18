import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [baselinePath, outputPath] = process.argv.slice(2);
if (!baselinePath || !outputPath) throw new Error('Usage: node prepare.mjs <scoped-baseline.json> <writes.json>');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const menuCSS = fs.readFileSync(path.join(here, 'menu.css'), 'utf8');
const oldProfile = 'https://www.instagram.com/_megapod_/';
const profile = 'https://www.instagram.com/_megapod/';
const allowed = new Set([
  'global-section:design-main-layout-header',
  'global-section:design-main-layout-footer',
  'page:tree-megapod',
  'page:tree-kontakt',
]);

const writes = baseline.items.map(item => {
  const key = `${item.itemType}:${item.itemKey}`;
  if (!allowed.delete(key)) throw new Error(`Unexpected or duplicate baseline item: ${key}`);
  const definition = structuredClone(item.definition);
  if (item.itemKey === 'design-main-layout-header') {
    const brand = definition.instance.slots.brand.find(i => i.instanceKey === 'megapod-light-header-brand');
    if (!brand?.customCode || brand.customCode.css.includes(menuCSS.trim())) throw new Error('Unexpected header or fix already present.');
    brand.customCode.css += '\n' + menuCSS;
  } else {
    const current = JSON.stringify(definition);
    if (!current.includes(oldProfile)) throw new Error(`Expected old Instagram profile in ${key}`);
    const replace = value => typeof value === 'string' ? value.replaceAll(oldProfile, profile)
      : Array.isArray(value) ? value.map(replace)
      : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k,v]) => [k,replace(v)]))
      : value;
    return { itemType: item.itemType, itemKey: item.itemKey, definition: replace(definition), expectedRevision: item.draftRevision };
  }
  return { itemType: item.itemType, itemKey: item.itemKey, definition, expectedRevision: item.draftRevision };
});
if (allowed.size) throw new Error('Incomplete scoped baseline.');
fs.writeFileSync(outputPath, JSON.stringify({ siteKey: baseline.siteKey, expectedSnapshotHash: baseline.snapshotHash, writes }, null, 2) + '\n');
console.log(`Prepared ${writes.length} scoped writes for Instagram and menu alignment.`);
