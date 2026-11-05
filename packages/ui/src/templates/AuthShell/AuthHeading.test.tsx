import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { AuthHeading } from './AuthHeading';

describe('AuthHeading', () => {
  it('renders the title as a level-2 heading with the sub line', () => {
    render(<AuthHeading title="Sign in" sub="Welcome back" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Sign in' })).toBeTruthy();
    expect(screen.getByText('Welcome back')).toBeTruthy();
  });

  it('omits the sub line when absent', () => {
    const { container } = render(<AuthHeading title="Sign in" />);
    expect(container.querySelectorAll('div').length).toBe(1);
  });
});
