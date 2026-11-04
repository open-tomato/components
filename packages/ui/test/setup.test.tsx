/**
 * Proves the render-test setup before any component test exists: a DOM is
 * registered, a component from the library renders into it, and its
 * variant classes reach the element. Component tests sit beside each
 * component as `<Name>.test.tsx`.
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Button } from '../src/atoms/Button';

describe('the render-test setup', () => {
  it('registers a DOM', () => {
    expect(typeof document.createElement).toBe('function');
  });

  it('renders a library component and fires its handler', () => {
    const onClick = mock(() => undefined);
    render(<Button onClick={onClick}>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(button);

    expect(button.className).not.toBe('');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
