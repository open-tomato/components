import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { createRef } from 'react';

import { OAuthButton } from './OAuthButton';

describe('OAuthButton', () => {
  it.each([
    ['google', 'Continue with Google'],
    ['github', 'Continue with GitHub'],
  ] as const)('renders the %s default label', (provider, name) => {
    render(<OAuthButton provider={provider} />);
    const button = screen.getByRole('button', { name });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.querySelector('svg')).not.toBeNull();
  });

  it('renders the google mark in four colors and the github mark mono', () => {
    const { container, rerender } = render(<OAuthButton provider="google" />);
    expect(container.querySelectorAll('svg path')).toHaveLength(4);
    rerender(<OAuthButton provider="github" />);
    expect(container.querySelectorAll('svg path')).toHaveLength(1);
  });

  it('uses a custom label and className, and forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<OAuthButton ref={ref} provider="github" label="Sign in" className="extra" />);
    const button = screen.getByRole('button', { name: 'Sign in' });
    expect(button.className).toContain('extra');
    expect(ref.current === button).toBe(true);
  });

  it('calls onClick and respects disabled', () => {
    const onClick = mock(() => {});
    const { rerender } = render(<OAuthButton provider="google" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<OAuthButton provider="google" onClick={onClick} disabled />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
