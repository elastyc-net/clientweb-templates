#!/usr/bin/env node
// Apply web template pack from git checkout into a tenant DB (definition only).
// Same apply as Web Site Templates → Import iz gita. Not a post-commit hook.
//
// Usage:
//   node tools/apply-webtemplate.mjs {Folder}
//   node tools/apply-webtemplate.mjs {Folder} [--instance {websyncinstance}]
//
// Env:
//   ELASTYC_APPLY_URL  - full apply endpoint (overrides host derived from --instance)
//   ELASTYC_APPLY_SKIP - if "1", exit immediately

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function hostForInstance(instance) {
  if (!instance || instance === 'templategallery') {
    return 'https://template-gallery.elastyc.net';
  }
  return `https://${instance}.elastyc.net`;
}

function applyUrl(instance) {
  if (process.env.ELASTYC_APPLY_URL) {
    return process.env.ELASTYC_APPLY_URL;
  }
  return `${hostForInstance(instance)}/incKomponente/webtemplates/applyjsonwebtemplate.php`;
}

function safeFolder(name) {
  const s = String(name || '').trim();
  if (!s || s.length > 64) return '';
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(s)) return '';
  return s;
}

function packExistsLocally(folder, instance) {
  const jsonName = `${folder}.json`;
  if (instance && instance !== 'templategallery') {
    const client = path.join(repoRoot, instance, folder, jsonName);
    if (fs.existsSync(client)) {
      return { ok: true, source: 'client', path: client };
    }
  }
  const canon = path.join(repoRoot, folder, jsonName);
  if (fs.existsSync(canon)) {
    return { ok: true, source: 'canon', path: canon };
  }
  return { ok: false };
}

function parseArgs(argv) {
  const out = { folder: '', instance: 'templategallery' };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--instance') {
      out.instance = rest[i + 1] || '';
      i++;
      continue;
    }
    if (a.startsWith('--instance=')) {
      out.instance = a.slice('--instance='.length);
      continue;
    }
    if (a.startsWith('-')) {
      console.error(`Nepoznat flag: ${a}`);
      process.exit(1);
    }
    if (!out.folder) {
      out.folder = a;
    } else {
      console.error('Zadaj tačno jedan Folder templejta.');
      process.exit(1);
    }
  }
  return out;
}

async function main() {
  if (process.env.ELASTYC_APPLY_SKIP === '1') {
    process.exit(0);
  }
  const args = parseArgs(process.argv);
  const folder = safeFolder(args.folder);
  const instance = safeFolder(args.instance) || 'templategallery';
  if (!folder) {
    console.error('Upotreba: node tools/apply-webtemplate.mjs {Folder} [--instance {websyncinstance}]');
    process.exit(1);
  }

  const local = packExistsLocally(folder, instance);
  if (!local.ok) {
    console.error(`Upozorenje: lokalno nema ${folder}.json. Apply ide na server disk.`);
  } else {
    console.log(`Lokalni pack: ${local.source} (${local.path})`);
  }

  const url = applyUrl(instance);
  console.log(`Endpoint: ${url}`);
  console.log(`Instance: ${instance}`);
  console.log(`Template: ${folder}`);

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ template: folder }),
    });
  } catch (e) {
    console.error(`Mrežna greška: ${e.message}`);
    process.exit(1);
  }

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error(`Neispravan odgovor servera (HTTP ${res.status}): ${text.slice(0, 400)}`);
    process.exit(1);
  }

  if (!json.ok && json.status !== 'OK') {
    const err = json.errors && json.errors.join ? json.errors.join('\n') : JSON.stringify(json);
    console.error(`[GRESKA] ${folder}: ${err}`);
    process.exit(1);
  }

  const bits = [
    json.created ? 'kreiran' : 'overwrite',
    `${json.recordsets ?? 0} recordseta`,
    json.source ? `izvor ${json.source}` : null,
  ].filter(Boolean);
  console.log(`[OK] ${json.naziv || json.template || folder}: ${bits.join(', ')}`);
  if (json.errors && json.errors.length) {
    console.error(json.errors.join('\n'));
    process.exit(1);
  }
  process.exit(0);
}

main();
