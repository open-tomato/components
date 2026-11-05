import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { Chip } from './Chip';

afterEach(cleanup);

describe('Chip', () => {
  it('renders its label without a remove button', () => {
    render(<Chip>Draft</Chip>);
    expect(screen.getByText('Draft')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders the icon', () => {
    render(<Chip icon={<i data-testid="ic" />}>Tag</Chip>);
    expect(screen.getByTestId('ic')).toBeTruthy();
  });

  it('fires onRemove from the remove button', () => {
    const onRemove = mock(() => undefined);
    render(<Chip onRemove={onRemove}>Tag</Chip>);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('merges a custom className', () => {
    render(<Chip className="custom">Tag</Chip>);
    expect(screen.getByText('Tag').className).toContain('custom');
  });
});
