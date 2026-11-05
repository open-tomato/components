import { describe, expect, it } from 'bun:test';

import { chartTone } from './chartTone';

describe('chartTone', () => {
  it('defaults to the accent tone', () => {
    expect(chartTone()).toBe('text-accent');
  });

  it.each([
    ['primary', 'text-primary'],
    ['gold', 'text-gold-500'],
    ['info', 'text-info'],
    ['success', 'text-success'],
    ['danger', 'text-danger'],
    ['neutral', 'text-fg2'],
    ['muted', 'text-fg3'],
  ] as const)('maps %s to %s', (tone, cls) => {
    expect(chartTone({ tone })).toBe(cls);
  });
});
