import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Touchable } from './Touchable';

describe('Touchable', () => {
  it('renders a button of type button and handles clicks', () => {
    const onClick = mock(() => undefined);
    render(<Touchable onClick={onClick}>Tap</Touchable>);
    const el = screen.getByRole('button', { name: 'Tap' });
    expect(el.getAttribute('type')).toBe('button');
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders each variant and merges className', () => {
    render(
      <Touchable inline stretch noBrightness rounded="full" className="extra">
        Tap
      </Touchable>,
    );
    expect(screen.getByRole('button').className).toContain('extra');
  });

  it('renders the child element with asChild', () => {
    render(
      <Touchable asChild>
        <a href="https://example.com">Link</a>
      </Touchable>,
    );
    const el = screen.getByRole('link', { name: 'Link' });
    expect(el.hasAttribute('type')).toBe(false);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
