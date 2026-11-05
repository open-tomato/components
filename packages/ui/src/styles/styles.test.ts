import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

const read = (name: string): string => readFileSync(join(import.meta.dir, name), 'utf8');

describe('style sheets', () => {
  it.each(['fonts.css', 'global.css', 'lib.css', 'theme.css', 'tokens.css'])('%s is non-empty with balanced braces', (name) => {
    const css = read(name).replace(/\/\*[\s\S]*?\*\//g, '');
    expect(css.trim().length).toBeGreaterThan(0);
    expect(css.split('{').length).toBe(css.split('}').length);
  });

  it('tokens define the colour custom properties components use', () => {
    const css = read('tokens.css') + read('theme.css');
    expect(css).toContain('--primary');
    expect(css).toContain('--accent');
  });
});
