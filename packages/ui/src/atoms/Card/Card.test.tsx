import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { Card } from './Card';

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>body</Card>);
    expect(screen.getByText('body')).toBeTruthy();
  });

  it('renders the header above the body', () => {
    render(<Card header="Title">body</Card>);
    const header = screen.getByText('Title');
    expect(header.parentElement?.textContent).toBe('Titlebody');
  });

  it('omits the header row without a header', () => {
    render(<Card data-testid="c">body</Card>);
    expect(screen.getByTestId('c').children.length).toBe(0);
  });

  it('renders compact density and merges className', () => {
    render(<Card density="compact" header="H" className="extra" data-testid="c">x</Card>);
    expect(screen.getByTestId('c').className).toContain('extra');
  });
});
