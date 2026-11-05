import { render } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { ICON_PATHS, StrokeIcon, type IconName } from './icons';

describe('StrokeIcon', () => {
  it('renders a 16px decorative stroke svg with the named path', () => {
    const { container } = render(<StrokeIcon name="check" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('16');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('path')?.getAttribute('d')).toBe(ICON_PATHS.check);
  });

  it('honours size and forwards svg props', () => {
    const { container } = render(<StrokeIcon name="x" size={24} className="extra" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('height')).toBe('24');
    expect(svg?.getAttribute('class')).toBe('extra');
  });

  it('renders every registered glyph', () => {
    for (const name of Object.keys(ICON_PATHS) as IconName[]) {
      const { container, unmount } = render(<StrokeIcon name={name} />);
      expect(container.querySelector('path')?.getAttribute('d')).toBe(ICON_PATHS[name]);
      unmount();
    }
  });
});
