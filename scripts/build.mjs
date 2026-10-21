import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSite, root } from './check.mjs';

// An explicit publication list keeps archived résumés and source tooling out of dist.
const files = [
  'index.html', 'assets/css/main.css', 'assets/js/main.js',
  'assets/files/Dan_Stingaciu_Resume.pdf', 'images/face2.jpg', 'images/social-preview.png',
  'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png',
  'android-chrome-192x192.png', 'android-chrome-512x512.png',
  'site.webmanifest', 'sitemap.xml', 'robots.txt'
];

export async function buildSite(output = resolve(root, 'dist')) {
  await checkSite();
  // Only clear generated output, never a source checkout or arbitrary directory.
  const target = resolve(output);
  if (target !== resolve(root, 'dist') && !/^portfolio-build-/.test(target.split('/').at(-1))) {
    throw new Error('Build output must be dist/ or a portfolio-build- temporary directory.');
  }
  await rm(target, { recursive: true, force: true });
  for (const file of files) {
    const destination = resolve(output, file);
    await mkdir(dirname(destination), { recursive: true });
    await cp(resolve(root, file), destination);
  }
  await checkSite(output);
  const bytes = (await Promise.all(files.map((file) => readFile(resolve(output, file))))).reduce((sum, buffer) => sum + buffer.length, 0);
  return { files: files.length, bytes, output };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildSite();
  console.log(`Built ${result.files} files (${Math.round(result.bytes / 1024)} KB) to ${result.output}`);
}
