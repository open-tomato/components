import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { Field } from './Field';

afterEach(cleanup);

describe('Field', () => {
  it('links the label to the input', () => {
    render(<Field label="Name" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input.id).toBeTruthy();
  });

  it('uses an explicit id', () => {
    render(<Field label="Name" id="custom-id" />);
    expect(screen.getByLabelText('Name').id).toBe('custom-id');
  });

  it('renders without label or helper', () => {
    const { container } = render(<Field />);
    expect(container.querySelector('label')).toBeNull();
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it.each(['default', 'error', 'success'] as const)('renders helper in state %s', (state) => {
    render(<Field state={state} helper="Helper text" />);
    expect(screen.getByText('Helper text')).toBeTruthy();
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(false);
  });

  it('disables the input in state disabled', () => {
    render(<Field state="disabled" />);
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
  });

  it.each(['sm', 'md'] as const)('renders size %s', (size) => {
    render(<Field size={size} />);
    expect(screen.getByRole('textbox').className).toContain(size === 'sm'
      ? 'h-8'
      : 'h-10');
  });

  it('renders a leading icon and pads the input', () => {
    render(<Field icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeTruthy();
    expect(screen.getByRole('textbox').className).toContain('pl-8');
  });

  it('reports typing through onChange', () => {
    const onChange = mock(() => {});
    render(<Field label="Name" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('abc');
  });
});
