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
  /** The role variable in tokens.css that names this family. */
  role: string;
  family: string;
  licence: string;
}

/**
 * The font contract: each role variable's stack starts with a family
 * fonts.css declares, and each family ships its licence. A consumer
 * switches fonts by redefining these four variables (README "Fonts").
 */
const FAMILIES: ShippedFamily[] = [
  { role: '--font-display', family: 'Bricolage Grotesque', licence: 'OFL-bricolage-grotesque.txt' },
  { role: '--font-body', family: 'Manrope', licence: 'OFL-manrope.txt' },
  { role: '--font-mono', family: 'JetBrains Mono', licence: 'OFL-jetbrains-mono.txt' },
  { role: '--font-accent', family: 'Sansita Swashed', licence: 'OFL-sansita-swashed.txt' },
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

  it.each(FAMILIES)('$role names $family first, the face fonts.css declares', ({ role, family }) => {
    const tokens = readFileSync(join(import.meta.dir, 'tokens.css'), 'utf8');
    const stack = new RegExp(`${role}:\\s*"([^"]+)"`).exec(tokens)?.[1];
    expect(stack).toBe(family);
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
