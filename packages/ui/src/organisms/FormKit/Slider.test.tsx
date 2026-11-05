import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Slider } from './Slider';

describe('Slider', () => {
  it('renders a range input with bounds and a plain readout', () => {
    render(<Slider value={40} onChange={() => {}} min={10} max={50} step={5} />);
    const input = screen.getByRole('slider') as HTMLInputElement;
    expect(input.min).toBe('10');
    expect(input.max).toBe('50');
    expect(input.step).toBe('5');
    expect(input.value).toBe('40');
    expect(input.style.getPropertyValue('--pct')).toBe('75%');
    expect(screen.getByText('40')).toBeTruthy();
  });

  it('formats the readout', () => {
    render(<Slider value={184000} max={200000} onChange={() => {}} format={(v) => `${v / 1000}k`} />);
    expect(screen.getByText('184k')).toBeTruthy();
  });

  it('reports numeric changes', () => {
    const onChange = mock((_v: number) => {});
    render(<Slider value={10} onChange={onChange} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '30' } });
    expect(onChange).toHaveBeenCalledWith(30);
  });
});
