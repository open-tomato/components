import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

/**
 * fonts.css serves the type faces from ./fonts/ by relative URL, and the
 * build copies that folder next to it in dist/styles/. These checks keep
 * the sheet and the folder in step: no rule reaches the network, every
 * URL names a shipped file, every shipped font is used, and each family
 * ships its licence.
 */

const FONTS_DIR = join(import.meta.dir, 'fonts');
const WOFF2_SIGNATURE = 'wOF2';

interface ShippedFamily {
  family: string;
  licence: string;
}

/** The families the theme's font stacks name, with their licence files. */
const FAMILIES: ShippedFamily[] = [
  { family: 'Bricolage Grotesque', licence: 'OFL-bricolage-grotesque.txt' },
  { family: 'Manrope', licence: 'OFL-manrope.txt' },
  { family: 'JetBrains Mono', licence: 'OFL-jetbrains-mono.txt' },
  { family: 'Sansita Swashed', licence: 'OFL-sansita-swashed.txt' },
];

const css = readFileSync(join(import.meta.dir, 'fonts.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const urls = [...css.matchAll(/url\(\s*["']?([^"')\s]+)/g)].map((match) => match[1] ?? '');
const shippedFonts = readdirSync(FONTS_DIR).filter((name) => name.endsWith('.woff2'));

describe('fonts.css', () => {
  it('imports nothing and names no remote URL', () => {
    expect(css).not.toContain('@import');
    expect(urls.filter((url) => /^(https?:)?\/\//.test(url))).toEqual([]);
  });

  it('points every url() at a woff2 file in ./fonts/', () => {
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url).toMatch(/^\.\/fonts\/[a-z0-9-]+\.woff2$/);
      expect(existsSync(join(import.meta.dir, url))).toBe(true);
    }
  });

  it('uses every shipped woff2 file once', () => {
    const named = urls.map((url) => url.replace('./fonts/', '')).sort();
    expect(named).toEqual([...shippedFonts].sort());
  });

  it.each(FAMILIES)('declares $family and ships its OFL licence', ({ family, licence }) => {
    expect(css).toContain(`font-family: '${family}';`);
    const text = readFileSync(join(FONTS_DIR, licence), 'utf8');
    expect(text).toContain(`The ${family} Project Authors`);
    expect(text).toContain('SIL Open Font License, Version 1.1');
  });
});

describe('fonts/', () => {
  it.each(shippedFonts)('%s is a woff2 file', (name) => {
    const head = readFileSync(join(FONTS_DIR, name)).subarray(0, WOFF2_SIGNATURE.length);
    expect(head.toString('latin1')).toBe(WOFF2_SIGNATURE);
  });
});
