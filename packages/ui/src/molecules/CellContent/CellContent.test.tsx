import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

// @@S mol-1 begin
import { AmountOverTime } from './AmountOverTime';
// @@S mol-1 end
import { CellBar } from './CellBar';
import { CellDecoration } from './CellDecoration';
import { CellDoubleLine } from './CellDoubleLine';
import { CellLabel } from './CellLabel';
import { CellStatus } from './CellStatus';
import { CellValue } from './CellValue';
// @@S mol-1 begin
import { QuotaProgress, QuotaUsage } from './QuotaUsage';
// @@S mol-1 end

const NOW = new Date(2026, 6, 22, 15, 0, 0);

describe('CellValue', () => {
  it('renders a numeric value with its unit', () => {
    const { container } = render(
      // @@S mol-1 begin
      <CellValue value={12500} unit="units" locale="en-US" />,
      // @@S mol-1 end
    );
    expect(container.textContent).toContain('12.5');
    // @@S mol-1 begin
    expect(container.textContent).toContain('units');
    // @@S mol-1 end
  });

  it('renders children when no value is given', () => {
    render(<CellValue>plain</CellValue>);
    expect(screen.getByText('plain')).toBeTruthy();
  });
});

describe('CellLabel', () => {
  it('renders a single label string', () => {
    render(<CellLabel labels="#1" />);
    expect(screen.getByText('#1')).toBeTruthy();
  });

  it('renders an array of strings and items with tones and soft bg', () => {
    render(
      <CellLabel
        labels={['alpha', { text: 'beta', tone: 'danger' }]}
        tone="accent"
        bg="soft"
      />,
    );
    expect(screen.getByText('alpha')).toBeTruthy();
    expect(screen.getByText('beta')).toBeTruthy();
  });
});

describe('CellStatus', () => {
  it.each(['ok', 'warn', 'err', 'info', 'disabled'] as const)(
    'renders the %s tone in each format with text',
    (tone) => {
      for (const format of ['rounded', 'square', 'icon'] as const) {
        const { unmount } = render(
          <CellStatus tone={tone} format={format} text={`${tone}-${format}`} pulse />,
        );
        expect(screen.getByText(`${tone}-${format}`)).toBeTruthy();
        unmount();
      }
    },
  );

  it('falls back to the tone as accessible name without text', () => {
    render(<CellStatus tone="warn" />);
    expect(screen.getByLabelText('warn')).toBeTruthy();
  });

  it('uses an explicit label for the icon format', () => {
    render(<CellStatus format="icon" tone="err" label="Failed" />);
    expect(screen.getByLabelText('Failed')).toBeTruthy();
  });
});

describe('CellDoubleLine', () => {
  it('renders title and subtitle', () => {
    render(<CellDoubleLine title="Name" subtitle="A longer subtitle" />);
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('A longer subtitle')).toBeTruthy();
  });

  it('omits the subtitle when absent', () => {
    const { container } = render(<CellDoubleLine title="Only" />);
    expect(container.querySelectorAll('span').length).toBe(1);
  });
});

describe('CellDecoration', () => {
  it('renders its children', () => {
    render(<CellDecoration>deco</CellDecoration>);
    expect(screen.getByText('deco')).toBeTruthy();
  });
});

describe('CellBar', () => {
  it('renders a meter for both strokes', () => {
    render(<CellBar ratio={0.5} stroke="mini" label="half" />);
    const meter = screen.getByRole('meter', { name: 'half' });
    expect(meter.getAttribute('aria-valuenow')).toBe('50');
    render(<CellBar ratio={0.25} />);
    expect(screen.getByRole('meter', { name: '25%' })).toBeTruthy();
  });

  it('renders the overflow treatment above 100%', () => {
    render(<CellBar ratio={2} />);
    const meter = screen.getByRole('meter', { name: '200%' });
    expect(meter.getAttribute('aria-valuenow')).toBe('100');
    expect(meter.children.length).toBe(3);
  });

  it('handles an infinite ratio', () => {
    render(<CellBar ratio={Number.POSITIVE_INFINITY} />);
    expect(screen.getByRole('meter', { name: 'over 100%' })).toBeTruthy();
  });
});

// @@S mol-1 begin
describe('AmountOverTime', () => {
  it('renders amount over duration and relative time', () => {
    const { container } = render(
      <AmountOverTime
        amount={0.42}
        seconds={437}
        date={new Date(2026, 6, 22, 12, 4, 0)}
        now={NOW}
        locale="en-US"
      />,
    );
    expect(container.textContent).toContain('$0.42');
    expect(container.textContent).toContain('·');
  });
});

describe('QuotaUsage', () => {
  it('renders the full used number over a short quota', () => {
    const { container } = render(
      <QuotaUsage used={8240} quota={50000} locale="en-US" />,
    );
    expect(container.textContent).toContain('8,240');
    expect(container.textContent).toContain('50');
  });
});

describe('QuotaProgress', () => {
  it('renders a meter with the default label', () => {
    render(<QuotaProgress used={100} quota={1000} locale="en-US" />);
    expect(screen.getByRole('meter', { name: '100 of 1000' })).toBeTruthy();
  });

  it('handles a zero quota with and without usage', () => {
    render(<QuotaProgress used={5} quota={0} label="over" />);
    expect(screen.getByRole('meter', { name: 'over' })).toBeTruthy();
    render(<QuotaProgress used={0} quota={0} label="none" />);
    expect(screen.getByRole('meter', { name: 'none' }).getAttribute('aria-valuenow')).toBe('0');
  });
});
// @@S mol-1 end
