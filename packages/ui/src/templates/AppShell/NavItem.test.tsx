import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { NavItem } from './NavItem';

describe('NavItem', () => {
  it('renders label and icon, and fires onClick', () => {
    const onClick = mock(() => {});
    render(<NavItem icon={<i data-testid="ic" />} onClick={onClick}>Home</NavItem>);
    expect(screen.getByTestId('ic')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Home' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('marks the active item as the current page', () => {
    render(<NavItem active>Home</NavItem>);
    expect(screen.getByRole('button', { name: 'Home' }).getAttribute('aria-current')).toBe('page');
  });

  it('has no aria-current when inactive', () => {
    render(<NavItem>Home</NavItem>);
    expect(screen.getByRole('button').hasAttribute('aria-current')).toBe(false);
  });

  it('hides the label when collapsed', () => {
    render(<NavItem collapsed title="Home" icon={<i />}>Home</NavItem>);
    expect(screen.getByRole('button').textContent).toBe('');
    expect(screen.getByTitle('Home')).toBeTruthy();
  });
});
