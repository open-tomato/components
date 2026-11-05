import { describe, expect, it, spyOn } from 'bun:test';

import {
  formatCurrency,
  formatDate,
  formatDuration,
  formatNumber,
  formatPercentage,
  formatRelativeTime,
  formatTime,
  resolveLocale,
  toDate,
} from './format';

import * as lib from './index';

describe('toDate', () => {
  it('returns Date instances unchanged', () => {
    const d = new Date(2026, 0, 2);
    expect(toDate(d)).toBe(d);
  });

  it('parses date-only strings as local midnight', () => {
    const d = toDate('2026-05-04');
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 4, 4, 0]);
  });

  it('parses epoch numbers and datetime strings', () => {
    expect(toDate(0).getTime()).toBe(0);
    expect(toDate('2026-05-04T10:00:00Z').getTime()).toBe(Date.UTC(2026, 4, 4, 10));
  });
});

describe('resolveLocale', () => {
  it('prefers the explicit locale', () => {
    expect(resolveLocale('de-DE')).toBe('de-DE');
  });

  it('falls back to a non-empty locale', () => {
    expect(resolveLocale().length).toBeGreaterThan(0);
  });
});

describe('number formatters', () => {
  it('formats numbers, plain and compact', () => {
    expect(formatNumber(12_345, { locale: 'en-US' })).toBe('12,345');
    expect(formatNumber(12_500, { locale: 'en-US', short: true })).toBe('12.5K');
    expect(formatNumber(1.234, { locale: 'en-US', precision: 2 })).toBe('1.23');
  });

  it('formats currency, plain and compact', () => {
    expect(formatCurrency(1234.5, 'usd', { locale: 'en-US' })).toBe('$1,234.50');
    expect(formatCurrency(1234, 'USD', { locale: 'en-US', short: true })).toBe('$1.2K');
    expect(formatCurrency(5, 'USD', { locale: 'en-US', precision: 0 })).toBe('$5');
  });

  it('formats percentages in ratio and raw mode', () => {
    expect(formatPercentage(0.1, { mode: 'ratio', locale: 'en-US' })).toBe('10%');
    expect(formatPercentage(10, { mode: 'raw', locale: 'en-US' })).toBe('10%');
    expect(formatPercentage(12.34, { mode: 'raw', precision: 1, signed: true, locale: 'en-US' })).toBe('+12.3%');
    expect(formatPercentage(0, { mode: 'raw', signed: true, locale: 'en-US' })).toBe('0%');
  });
});

describe('formatDuration', () => {
  it('formats seconds and omits zero units', () => {
    expect(formatDuration(3670)).toBe('1h 1m 10s');
    expect(formatDuration(3610)).toBe('1h 10s');
    expect(formatDuration(90_061)).toBe('1d 1h 1m 1s');
    expect(formatDuration(0)).toBe('0s');
  });

  it('formats a date range', () => {
    expect(formatDuration({ from: 0, to: 61_000 })).toBe('1m 1s');
  });

  it('clamps negative input to 0s with a warning', () => {
    const warn = spyOn(console, 'warn').mockImplementation(() => {});
    expect(formatDuration(-5)).toBe('0s');
    expect(formatDuration({ from: 5000, to: 0 })).toBe('0s');
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });
});

describe('date formatters', () => {
  it('formats a date with the default and a custom style', () => {
    expect(formatDate('2026-05-04', { locale: 'en-US' })).toBe('May 4, 2026');
    expect(formatDate('2026-05-04', { locale: 'en-US', dateStyle: 'short' })).toBe('5/4/26');
  });

  it('formats a time as hh:mm', () => {
    expect(formatTime(new Date(2026, 4, 4, 9, 5), 'en-US')).toMatch(/09:05/);
  });
});

describe('formatRelativeTime', () => {
  const now = new Date(2026, 5, 15, 12, 0, 0);
  const rel = (ms: number) => formatRelativeTime(new Date(now.getTime() + ms), { locale: 'en-US', now });
  const H = 3_600_000;
  const D = 24 * H;

  it('shows the clock for the same calendar day', () => {
    expect(rel(-H)).toMatch(/11:00/);
  });

  it('walks the ladder into the past', () => {
    expect(rel(-15 * H)).toBe('15 hours ago');
    expect(rel(-30 * H)).toBe('yesterday');
    expect(rel(-3 * D)).toBe('3 days ago');
    expect(rel(-8 * D)).toBe('last week');
    expect(rel(-15 * D)).toBe('2 weeks ago');
    expect(rel(-40 * D)).toBe('last month');
    expect(rel(-100 * D)).toBe('3 months ago');
    expect(rel(-400 * D)).toBe('last year');
    expect(rel(-800 * D)).toBe('2 years ago');
  });

  it('mirrors the ladder into the future', () => {
    expect(rel(30 * H)).toBe('tomorrow');
    expect(rel(3 * D + H)).toBe('in 3 days');
  });

  it('defaults "now" to the current time', () => {
    expect(formatRelativeTime(new Date(), { locale: 'en-US' })).toMatch(/\d/);
  });
});

describe('lib barrel', () => {
  it('re-exports the public helpers and not the internal ones', () => {
    expect(typeof lib.cn).toBe('function');
    expect(typeof lib.chartTone).toBe('function');
    expect(typeof lib.initials).toBe('function');
    expect(typeof lib.passwordStrength).toBe('function');
    expect(typeof lib.formatNumber).toBe('function');
    expect('devWarn' in lib).toBe(false);
  });
});
