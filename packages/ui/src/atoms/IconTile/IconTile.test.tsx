import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { IconTile } from './IconTile';

describe('IconTile', () => {
  it.each(['accent', 'primary', 'success'] as const)('renders the %s tone', (tone) => {
    render(<IconTile tone={tone} icon={<b>ic</b>} />);
    expect(screen.getByText('ic').parentElement?.tagName).toBe('SPAN');
  });

  it.each(['sm', 'md', 'lg', 'xl', '2xl'] as const)('renders the %s size', (size) => {
    render(<IconTile size={size} shape="circle" className="extra" icon={<b>ic</b>} />);
    expect(screen.getByText('ic').parentElement?.className).toContain('extra');
  });

  it('renders the pulse ring only when asked', () => {
    const { container, rerender } = render(<IconTile icon="x" />);
    expect(container.querySelector('[aria-hidden]')).toBeNull();
    rerender(<IconTile icon="x" pulse />);
    expect(container.querySelector('[aria-hidden]')).not.toBeNull();
  });
});
