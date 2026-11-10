import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Materialize readable HTML/CSS/JS into the native component documents.
// This prepares local files only. It does not save, build or publish a Site.
const directory = path.dirname(fileURLToPath(import.meta.url));
for (const name of (await readdir(path.join(directory, 'components'))).filter(name => name.endsWith('.json'))) {
  const filename = path.join(directory, 'components', name);
  const definition = JSON.parse(await readFile(filename, 'utf8'));
  definition.htmlContent = (await readFile(filename.replace(/\.json$/, '.html'), 'utf8')).trimEnd();
  if (definition.componentKey === 'kb-sales-hero') {
    definition.styles[0].content = await readFile(path.join(directory, 'kb-sales.css'), 'utf8');
    definition.scripts[0].content = await readFile(path.join(directory, 'kb-sales.js'), 'utf8');
  }
  await writeFile(filename, `${JSON.stringify(definition, null, 2)}\n`);
}
