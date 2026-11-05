import { render } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { FakeQrCode } from './fake-qr';

describe('FakeQrCode', () => {
  it('renders a 172px svg by default with modules and 3 finders', () => {
    const { container } = render(<FakeQrCode />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('172');
    expect(container.querySelectorAll('g').length).toBe(3);
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(9);
  });

  it('is deterministic and honours size', () => {
    const a = render(<FakeQrCode size={100} />);
    const html = a.container.innerHTML;
    a.unmount();
    const b = render(<FakeQrCode size={100} />);
    expect(b.container.innerHTML).toBe(html);
    expect(b.container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 100 100');
  });
});
