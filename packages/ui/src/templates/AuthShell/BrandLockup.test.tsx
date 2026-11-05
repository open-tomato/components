import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { BrandLockup } from './BrandLockup';

describe('BrandLockup', () => {
  it('links to "#" by default and shows the wordmark', () => {
    render(<BrandLockup />);
    expect(screen.getByRole('link').getAttribute('href')).toBe('#');
    expect(screen.getByText('open')).toBeTruthy();
    expect(screen.getByText('tomato')).toBeTruthy();
  });

  it('uses a custom href', () => {
    render(<BrandLockup href="https://example.com" />);
    expect(screen.getByRole('link').getAttribute('href')).toBe('https://example.com');
  });
});
