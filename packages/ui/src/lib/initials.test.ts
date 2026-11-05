import { describe, expect, it } from 'bun:test';

import { initials } from './initials';

describe('initials', () => {
  it.each([
    ['refactor-bot', 'RB'],
    ['Jane Lin', 'JL'],
    ['jane marie lin', 'JM'],
    ['solo', 'S'],
    ['', ''],
    ['  --  ', ''],
  ])('%j → %j', (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});
