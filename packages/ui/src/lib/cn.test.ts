import { describe, expect, it } from 'bun:test';

import { cn } from './cn';

describe('cn', () => {
  it('joins truthy classes and drops falsy ones', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('lets the later tailwind class win', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('returns an empty string without input', () => {
    expect(cn()).toBe('');
  });
});
