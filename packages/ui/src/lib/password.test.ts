import { describe, expect, it } from 'bun:test';

import { passwordStrength } from './password';

describe('passwordStrength', () => {
  it('scores an empty password 0', () => {
    expect(passwordStrength('')).toEqual({ score: 0, label: 'empty' });
  });

  it('scores a short lowercase password as weak', () => {
    expect(passwordStrength('abc')).toEqual({ score: 0, label: 'weak' });
    expect(passwordStrength('abcdefgh')).toEqual({ score: 1, label: 'weak' });
  });

  it('adds a point per criterion up to great', () => {
    expect(passwordStrength('abcdefg1').score).toBe(2);
    expect(passwordStrength('Abcdefg1').score).toBe(3);
    expect(passwordStrength('Abcdefg1!').score).toBe(4);
    expect(passwordStrength('Abcdefghij1!').score).toBe(5);
    expect(passwordStrength('Abcdefghij1!').label).toBe('great');
  });
});
