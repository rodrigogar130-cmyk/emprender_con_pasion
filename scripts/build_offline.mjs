/** Empaqueta las dos versiones offline sin requerir Python. */
import { readFile, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = async (path) => readFile(resolve(root, path), 'utf8');
const dataUri = async (path, mime) => `data:${mime};base64,${(await readFile(resolve(root, path))).toString('base64')}`;

const content = (await source('assets/js/content.js')).replaceAll('export const ', 'const ');
const main = (await source('assets/js/main.js')).replace("import {MODULES, BIO, CLOSING_NOTES} from './content.js';", '');
const presenterJs = (await source('assets/js/presenter.js')).replace("import {MODULES,CLOSING_NOTES} from './content.js';", '');
const icon = await dataUri('assets/img/icono.svg', 'image/svg+xml');

let presentation = await source('index.html');
presentation = presentation.replace('<link rel="stylesheet" href="assets/css/styles.css" />', `<style>\n${await source('assets/css/styles.css')}\n</style>`);
presentation = presentation.replace('<script type="module" src="assets/js/main.js"></script>', '');
presentation = presentation.replaceAll('assets/img/carlos-rodrigo-original.jpeg', await dataUri('assets/img/carlos-rodrigo-original.jpeg', 'image/jpeg'));
presentation = presentation.replaceAll('assets/img/carlos-rodrigo-sin-fondo.png', await dataUri('assets/img/carlos-rodrigo-sin-fondo.png', 'image/png'));
presentation = presentation.replaceAll('assets/img/qr-portafolio.svg', await dataUri('assets/img/qr-portafolio.svg', 'image/svg+xml'));
presentation = presentation.replaceAll('assets/img/icono.svg', icon);
presentation = presentation.replace('</body>', `<script>\n${content}\n${main}\n</script>\n</body>`);
await writeFile(resolve(root, 'EMPRENDER-CON-PASION-OFFLINE.html'), presentation, 'utf8');

let presenter = await source('presenter.html');
presenter = presenter.replace('<script type="module" src="assets/js/presenter.js"></script>', '');
presenter = presenter.replaceAll('assets/img/icono.svg', icon);
presenter = presenter.replace('</body>', `<script>\n${content}\n${presenterJs}\n</script>\n</body>`);
await writeFile(resolve(root, 'presenter-offline.html'), presenter, 'utf8');

console.log(`Offline generado: ${(await stat(resolve(root, 'EMPRENDER-CON-PASION-OFFLINE.html'))).size} bytes`);
