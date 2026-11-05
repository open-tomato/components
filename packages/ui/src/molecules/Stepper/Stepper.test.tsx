import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Stepper } from './Stepper';

const items = [
  { key: 'a', label: 'Account' },
  { key: 'b', label: 'Profile' },
  { key: 'c', label: 'Done' },
];

describe('Stepper', () => {
  it('renders a read-only rail without buttons', () => {
    render(<Stepper items={items} index={1} data-testid="rail" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getByText('Account')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByTestId('rail')).toBeTruthy();
  });

  it('shows a check instead of a number for done steps', () => {
    const { container } = render(<Stepper items={items} index={2} />);
    expect(container.querySelectorAll('svg')).toHaveLength(2);
    expect(screen.queryByText('1')).toBeNull();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('renders the accent tone and sm size', () => {
    const { container } = render(
      <Stepper items={items} index={0} tone="accent" size="sm" className="extra" />,
    );
    expect((container.firstChild as HTMLElement).className).toContain('extra');
    expect(screen.getByText('Account')).toBeTruthy();
  });

  it('reports the clicked step index when interactive', () => {
    const onChange = mock((_: number) => {});
    render(<Stepper items={items} index={0} onChange={onChange} size="sm" />);
    fireEvent.click(screen.getByRole('button', { name: /Profile/ }));
    expect(onChange).toHaveBeenCalledWith(1);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
});
