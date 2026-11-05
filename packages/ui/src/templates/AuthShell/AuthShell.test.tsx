import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { AuthShell } from './AuthShell';

describe('AuthShell', () => {
  // @@S tpl-1 begin
  it('renders brand, eyebrow, children and footer', () => {
    render(
      <AuthShell brand={<a href="#home">Brand</a>} eyebrow="welcome back" footer={<span>New here?</span>}>
        <p>card body</p>
      </AuthShell>,
    );
    expect(screen.getByRole('link').getAttribute('href')).toBe('#home');
    expect(screen.getByText('welcome back')).toBeTruthy();
    expect(screen.getByText('card body')).toBeTruthy();
    expect(screen.getByText('New here?')).toBeTruthy();
  });

  it('omits brand, eyebrow and footer when absent', () => {
    const { container } = render(<AuthShell><p>body</p></AuthShell>);
    expect(screen.queryByRole('link')).toBeNull();
    expect(container.querySelector('section')?.children.length).toBe(1);
    expect(container.firstElementChild?.children.length).toBe(1);
  });
  // @@S tpl-1 end

  it('renders the xl width and forwards className/props', () => {
    const { container } = render(
      <AuthShell width="xl" className="extra" data-testid="shell"><p>b</p></AuthShell>,
    );
    expect(screen.getByTestId('shell').className).toContain('extra');
    expect(container.querySelector('section')).toBeTruthy();
  });
});
