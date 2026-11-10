import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Update native Draft documents from the readable local sources. No CMS writes.
const directory = path.dirname(fileURLToPath(import.meta.url));
for (const name of (await readdir(path.join(directory, 'components'))).filter(name => name.endsWith('.json'))) {
  const filename = path.join(directory, 'components', name);
  const definition = JSON.parse(await readFile(filename, 'utf8'));
  definition.htmlContent = (await readFile(filename.replace(/\.json$/, '.html'), 'utf8')).trim();
  if (definition.componentKey === 'elastyc-site-navigation') definition.scripts[0].content = await readFile(path.join(directory, 'navigation.js'), 'utf8');
  if (definition.componentKey === 'elastyc-site-footer') definition.styles[0].content = await readFile(path.join(directory, 'footer.css'), 'utf8');
  await writeFile(filename, `${JSON.stringify(definition, null, 2)}\n`);
}
const layoutPath = path.join(directory, 'layout.json');
const layout = JSON.parse(await readFile(layoutPath, 'utf8'));
layout.styles[0].content = await readFile(path.join(directory, 'header.css'), 'utf8');
await writeFile(layoutPath, `${JSON.stringify(layout, null, 2)}\n`);
