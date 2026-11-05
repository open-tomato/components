import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';

import { FormattedCurrency } from './FormattedCurrency';
import { FormattedDate } from './FormattedDate';
import { FormattedDuration } from './FormattedDuration';
import { FormattedPercentage } from './FormattedPercentage';
import { FormattedRelativeTime } from './FormattedRelativeTime';
import { FormattedValue } from './FormattedValue';
import { HumanReadableValue } from './HumanReadableValue';

afterEach(cleanup);

const LOCALE = 'en-US';
const REF_NOW = new Date(2026, 6, 22, 15, 0, 0);
const SAME_DAY = new Date(2026, 6, 22, 9, 5, 0);
const YESTERDAY = new Date(2026, 6, 21, 9, 0, 0);

describe('HumanReadableValue', () => {
  it('compacts by default and shows the unit', () => {
    const { container } = render(<HumanReadableValue value={8240} unit="tokens" locale={LOCALE} />);
    expect(container.textContent).toBe('8.2Ktokens');
    expect(container.querySelector('span span')?.textContent).toBe('tokens');
  });

  it('prints the full number when short is false', () => {
    const { container } = render(<HumanReadableValue value={8240} short={false} locale={LOCALE} />);
    expect(container.textContent).toBe('8,240');
    expect(container.querySelector('span span')).toBeNull();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size %s', (size) => {
    const { container } = render(<HumanReadableValue value={12500} unit="runs" size={size} locale={LOCALE} />);
    expect(container.textContent).toContain('runs');
  });
});

describe('FormattedCurrency', () => {
  it('formats with two decimals by default', () => {
    const { container } = render(<FormattedCurrency value={1234.5} currency="usd" locale={LOCALE} />);
    expect(container.textContent).toBe('$1,234.50');
  });

  it('honours precision', () => {
    const { container } = render(<FormattedCurrency value={1234.5} currency="usd" precision={0} locale={LOCALE} />);
    expect(container.textContent).toContain('1,23');
    expect(container.textContent).not.toContain('.');
  });

  it('compacts when short', () => {
    const { container } = render(<FormattedCurrency value={1234.5} currency="usd" short locale={LOCALE} />);
    expect(container.textContent).toBe('$1.2K');
  });

  it('renders other currencies', () => {
    const { container } = render(<FormattedCurrency value={99.9} currency="eur" locale={LOCALE} />);
    expect(container.textContent).toBe('€99.90');
  });
});

describe('FormattedPercentage', () => {
  it('reads ratio and raw modes alike', () => {
    const a = render(<FormattedPercentage value={0.1} mode="ratio" locale={LOCALE} />);
    expect(a.container.textContent).toBe('10%');
    const b = render(<FormattedPercentage value={10} mode="raw" locale={LOCALE} />);
    expect(b.container.textContent).toBe('10%');
  });

  it('signs and applies precision', () => {
    const { container } = render(<FormattedPercentage value={0.153} mode="ratio" signed precision={1} locale={LOCALE} />);
    expect(container.textContent).toBe('+15.3%');
  });

  it('shows a negative sign', () => {
    const { container } = render(<FormattedPercentage value={-0.3} mode="ratio" signed locale={LOCALE} />);
    expect(container.textContent).toContain('30%');
    expect(container.textContent).toMatch(/^[-−]/);
  });
});

describe('FormattedDate', () => {
  it('renders a time element with a dateTime', () => {
    const { container } = render(<FormattedDate date={SAME_DAY} locale={LOCALE} />);
    const el = container.querySelector('time');
    expect(el?.getAttribute('datetime')).toBe(SAME_DAY.toISOString());
    expect(el?.textContent).toBe('Jul 22, 2026');
  });

  it('honours dateStyle', () => {
    const { container } = render(<FormattedDate date={SAME_DAY} dateStyle="full" locale={LOCALE} />);
    expect(container.textContent).toBe('Wednesday, July 22, 2026');
  });

  it('reads a date-only string as a local calendar date', () => {
    const { container } = render(<FormattedDate date="2026-05-04" locale={LOCALE} />);
    expect(container.textContent).toBe('May 4, 2026');
  });

  it('formats a datetime string', () => {
    const { container } = render(<FormattedDate date="2026-05-04T12:00:00" locale={LOCALE} />);
    expect(container.textContent).toBe('May 4, 2026');
  });

  it('formats in another locale', () => {
    const { container } = render(<FormattedDate date={SAME_DAY} locale="de-DE" />);
    expect(container.textContent).toContain('2026');
    expect(container.textContent).not.toBe('Jul 22, 2026');
  });
});

describe('FormattedDuration', () => {
  it.each([
    [3790, '1h 3m 10s'],
    [3610, '1h 10s'],
    [42, '42s'],
    [0, '0s'],
  ] as const)('formats %d seconds', (seconds, text) => {
    const { container } = render(<FormattedDuration seconds={seconds} />);
    expect(container.textContent).toBe(text);
  });

  it('formats a date range', () => {
    const { container } = render(
      <FormattedDuration
        from={new Date(2026, 6, 21, 10, 0, 0)}
        to={new Date(2026, 6, 22, 11, 3, 10)}
      />,
    );
    expect(container.textContent).toBe('1d 1h 3m 10s');
  });
});

describe('FormattedRelativeTime', () => {
  it('shows hh:mm for the same day with a full-date title', () => {
    const { container } = render(<FormattedRelativeTime date={SAME_DAY} now={REF_NOW} locale={LOCALE} />);
    const el = container.querySelector('time');
    expect(el?.textContent).toContain('9:05');
    expect(el?.getAttribute('title')).toBe('Wednesday, July 22, 2026');
    expect(el?.getAttribute('datetime')).toBe(SAME_DAY.toISOString());
  });

  it.each([
    [new Date(2026, 6, 21, 9, 0, 0), 'yesterday'],
    [new Date(2026, 6, 19, 9, 0, 0), '3 days ago'],
    [new Date(2026, 6, 13, 9, 0, 0), 'last week'],
    [new Date(2026, 6, 1, 9, 0, 0), '3 weeks ago'],
    [new Date(2026, 5, 10, 9, 0, 0), 'last month'],
    [new Date(2026, 0, 10, 9, 0, 0), '6 months ago'],
    [new Date(2025, 5, 10, 9, 0, 0), 'last year'],
    [new Date(2023, 5, 10, 9, 0, 0), '3 years ago'],
  ] as const)('renders the ladder step %#', (date, text) => {
    const { container } = render(<FormattedRelativeTime date={date} now={REF_NOW} locale={LOCALE} />);
    expect(container.textContent?.toLowerCase()).toContain(text);
  });

  it('crosses midnight within 24h as hours ago', () => {
    const { container } = render(
      <FormattedRelativeTime date={new Date(2026, 6, 21, 22, 0, 0)} now={REF_NOW} locale={LOCALE} />,
    );
    expect(container.textContent).toContain('hours ago');
  });
});

describe('FormattedValue', () => {
  it('dispatches number', () => {
    const { container } = render(<FormattedValue type="number" value={8240} unit="tokens" locale={LOCALE} />);
    expect(container.textContent).toBe('8.2Ktokens');
  });

  it('dispatches currency', () => {
    const { container } = render(<FormattedValue type="currency" value={12.4} currency="usd" locale={LOCALE} />);
    expect(container.textContent).toBe('$12.40');
  });

  it('dispatches percentage', () => {
    const { container } = render(<FormattedValue type="percentage" value={0.62} mode="ratio" locale={LOCALE} />);
    expect(container.textContent).toBe('62%');
  });

  it('dispatches date', () => {
    const { container } = render(<FormattedValue type="date" date={SAME_DAY} locale={LOCALE} />);
    expect(container.querySelector('time')?.textContent).toBe('Jul 22, 2026');
  });

  it('dispatches duration', () => {
    const { container } = render(<FormattedValue type="duration" seconds={3790} />);
    expect(container.textContent).toBe('1h 3m 10s');
  });

  it('dispatches relative-time', () => {
    const { container } = render(<FormattedValue type="relative-time" date={YESTERDAY} now={REF_NOW} locale={LOCALE} />);
    expect(container.textContent?.toLowerCase()).toContain('yesterday');
  });
});
