import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { Tag } from './Tag';

describe('Tag', () => {
  it.each(['neutral', 'success', 'warning', 'danger', 'info'] as const)(
    'renders the %s tone',
    (tone) => {
      render(<Tag tone={tone}>label</Tag>);
      expect(screen.getByText('label').tagName).toBe('SPAN');
    },
  );

  it('uses mono by default and the body face with an icon', () => {
    const { rerender } = render(<Tag>a</Tag>);
    expect(screen.getByText('a').className).toContain('font-mono');
    rerender(<Tag icon={<i>i</i>}>a</Tag>);
    expect(screen.getByText('a').className).toContain('font-body');
  });

  it('lets an explicit mono win over the icon', () => {
    render(<Tag mono icon={<i>i</i>} className="extra">a</Tag>);
    const el = screen.getByText('a');
    expect(el.className).toContain('font-mono');
    expect(el.className).toContain('extra');
  });
});
