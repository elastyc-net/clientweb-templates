#!/usr/bin/env node
// Sync web template shell code from this repo into tenant DB (html/js/css/scripts/styles).
// Does not apply recordsets. Analog common/tools/sync-proces-js.mjs
//
// Usage:
//   node tools/sync-webtemplate-code.mjs {Folder} [--instance {websyncinstance}]
//   node tools/sync-webtemplate-code.mjs --last-commit
//   node tools/sync-webtemplate-code.mjs --all-changed
//
// Env:
//   ELASTYC_SYNC_SKIP - if "1", exit immediately

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skipTop = new Set(['tools', '.git', '.cursor', '.githooks', '.github']);

function git(cmd) {
  try {
    return execSync(cmd, { cwd: repoRoot, encoding: 'utf8' });
  } catch {
    return '';
  }
}

function hostForInstance(instance) {
  if (!instance || instance === 'templategallery') {
    return 'https://template-gallery.elastyc.net';
  }
  return `https://${instance}.elastyc.net`;
}

function upgradeUrl(instance) {
  if (process.env.ELASTYC_SYNC_URL) {
    return process.env.ELASTYC_SYNC_URL;
  }
  return `${hostForInstance(instance)}/incKomponente/webtemplates/elastyc_webtemplate_code_upgrade.php`;
}

function safeFolder(name) {
  const s = String(name || '').trim();
  if (!s || s.length > 64) return '';
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(s)) return '';
  return s;
}

function packsFromPaths(paths) {
  const out = [];
  const seen = new Set();
  for (const f of paths) {
    const rel = String(f).trim().replace(/\\/g, '/');
    if (!rel) continue;
    let m = rel.match(/^([^/]+)\/\1(?:\.(html|js|css)|-(scripts|styles)\.html)$/);
    if (m && !skipTop.has(m[1])) {
      const key = `templategallery:${m[1]}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ folder: m[1], instance: 'templategallery' });
      }
      continue;
    }
    m = rel.match(/^([^/]+)\/([^/]+)\/\2(?:\.(html|js|css)|-(scripts|styles)\.html)$/);
    if (m && !skipTop.has(m[1])) {
      const key = `${m[1]}:${m[2]}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ folder: m[2], instance: m[1] });
      }
    }
  }
  return out;
}

function lastCommitPacks() {
  return packsFromPaths(git('git diff-tree --no-commit-id --name-only -r HEAD').split('\n'));
}

function changedPacks() {
  const files = new Set();
  for (const line of git('git status --porcelain').split('\n')) {
    const f = line.slice(3).trim();
    if (f) files.add(f);
  }
  for (const f of git('git diff --name-only HEAD~1 HEAD').split('\n')) {
    if (f.trim()) files.add(f.trim());
  }
  return packsFromPaths([...files]);
}

function readIfExists(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function ensureTrailingNewline(s) {
  if (s == null) return s;
  return s.endsWith('\n') ? s : s + '\n';
}

function packDir(folder, instance) {
  if (instance && instance !== 'templategallery') {
    return path.join(repoRoot, instance, folder);
  }
  return path.join(repoRoot, folder);
}

function nazivFromJson(dir, folder) {
  const p = path.join(dir, `${folder}.json`);
  if (!fs.existsSync(p)) return folder;
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    const obj = Array.isArray(data) ? data[0] : data;
    if (obj && obj.naziv) return String(obj.naziv);
  } catch {
    // ignore
  }
  return folder;
}

async function syncOne(folder, instance) {
  const dir = packDir(folder, instance);
  if (!fs.existsSync(dir)) {
    return { folder, instance, ok: false, error: `folder ne postoji: ${dir}` };
  }
  const html = readIfExists(path.join(dir, `${folder}.html`));
  let js = readIfExists(path.join(dir, `${folder}.js`));
  let css = readIfExists(path.join(dir, `${folder}.css`));
  const scripts = readIfExists(path.join(dir, `${folder}-scripts.html`));
  const styles = readIfExists(path.join(dir, `${folder}-styles.html`));
  if (html === null && js === null && css === null && scripts === null && styles === null) {
    return { folder, instance, ok: false, error: 'nema code fajlova' };
  }
  js = ensureTrailingNewline(js);
  css = ensureTrailingNewline(css);
  const naziv = nazivFromJson(dir, folder);
  const payload = { naziv };
  if (html !== null) payload.html = html;
  if (js !== null) payload.templatejs = js;
  if (css !== null) payload.css = css;
  if (scripts !== null) payload.templatescripts = scripts;
  if (styles !== null) payload.templatestyles = styles;

  const url = upgradeUrl(instance);
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    return { folder, instance, ok: false, error: `mrezna greska: ${e.message}` };
  }
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    return { folder, instance, ok: false, error: `neispravan odgovor (HTTP ${res.status}): ${text.slice(0, 300)}` };
  }
  if (json.status !== 'OK') {
    return { folder, instance, ok: false, error: JSON.stringify(json.errors ?? json).slice(0, 500) };
  }
  return { folder, instance, ok: true, updated: json.updated, naziv: json.naziv || naziv };
}

function parseArgs(argv) {
  const out = { folders: [], instance: '', lastCommit: false, allChanged: false };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--last-commit') {
      out.lastCommit = true;
      continue;
    }
    if (a === '--all-changed') {
      out.allChanged = true;
      continue;
    }
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
    out.folders.push(a);
  }
  return out;
}

async function main() {
  if (process.env.ELASTYC_SYNC_SKIP === '1') {
    process.exit(0);
  }
  const args = parseArgs(process.argv);
  let jobs = [];
  if (args.lastCommit) {
    jobs = lastCommitPacks();
  } else if (args.allChanged) {
    jobs = changedPacks();
  } else if (args.folders.length) {
    const inst = safeFolder(args.instance) || 'templategallery';
    for (const f of args.folders) {
      const folder = safeFolder(f);
      if (folder) jobs.push({ folder, instance: inst });
    }
  }
  if (!jobs.length) {
    console.error('Nema templejta za sync. Zadaj Folder ili --last-commit / --all-changed.');
    process.exit(1);
  }

  let failed = 0;
  for (const job of jobs) {
    const r = await syncOne(job.folder, job.instance);
    if (r.ok) {
      console.log(`[OK] ${r.instance}/${r.folder} (${r.naziv}): ${(r.updated || []).join(' + ')}`);
    } else {
      failed++;
      console.error(`[GRESKA] ${job.instance}/${job.folder}: ${r.error}`);
    }
  }
  process.exit(failed ? 1 : 0);
}

main();
