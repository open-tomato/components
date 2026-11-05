import { describe, expect, it } from 'bun:test';

import * as root from './index';

describe('package root barrel', () => {
  it('exports cn and a component from every layer', () => {
    expect(typeof root.cn).toBe('function');
    expect(root.Button).toBeDefined();
    expect(root.Breadcrumb).toBeDefined();
    expect(root.Table).toBeDefined();
    expect(root.AppShell).toBeDefined();
  });

  it('does not leak internals or story fixtures', () => {
    for (const name of ['devWarn', 'StrokeIcon', 'TomatoMark', 'FakeQrCode', 'LiveShell']) {
      expect(name in root).toBe(false);
    }
  });
});
