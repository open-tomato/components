import { render } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { TomatoMark } from './TomatoMark';

describe('TomatoMark', () => {
  it('renders a decorative 30px svg by default', () => {
    const { container } = render(<TomatoMark />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('30');
    expect(svg?.getAttribute('height')).toBe('30');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('honours the size prop', () => {
    const { container } = render(<TomatoMark size={64} />);
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('64');
  });
});
