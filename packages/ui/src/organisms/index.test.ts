import { describe, expect, it } from 'bun:test';

import * as barrel from './index';

describe('organisms barrel', () => {
  it('exports components that are defined', () => {
    const entries = Object.entries(barrel);
    expect(entries.length).toBeGreaterThan(0);
    for (const [, value] of entries) expect(value).toBeDefined();
  });
});
