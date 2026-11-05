import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { AuthShell } from './AuthShell';

describe('AuthShell', () => {
  it('renders brand, eyebrow, children and footer', () => {
    render(
      <AuthShell eyebrow="welcome back" footer={<span>New here?</span>}>
        <p>card body</p>
      </AuthShell>,
    );
    expect(screen.getByRole('link')).toBeTruthy();
    expect(screen.getByText('welcome back')).toBeTruthy();
    expect(screen.getByText('card body')).toBeTruthy();
    expect(screen.getByText('New here?')).toBeTruthy();
  });

  it('omits eyebrow and footer when absent', () => {
    const { container } = render(<AuthShell brandHref="/x"><p>body</p></AuthShell>);
    expect(screen.getByRole('link').getAttribute('href')).toBe('/x');
    expect(container.querySelector('section')?.children.length).toBe(1);
    expect(container.firstElementChild?.children.length).toBe(2);
  });

  it('renders the xl width and forwards className/props', () => {
    const { container } = render(
      <AuthShell width="xl" className="extra" data-testid="shell"><p>b</p></AuthShell>,
    );
    expect(screen.getByTestId('shell').className).toContain('extra');
    expect(container.querySelector('section')).toBeTruthy();
  });
});
