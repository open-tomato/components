import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { createRef } from 'react';

import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders the value with default rows', () => {
    render(<Textarea value="hello" onChange={() => {}} aria-label="Bio" />);
    const el = screen.getByRole('textbox', { name: 'Bio' }) as HTMLTextAreaElement;
    expect(el.value).toBe('hello');
    expect(el.getAttribute('rows')).toBe('3');
  });

  it('honours rows, invalid styling hook and forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} value="" rows={6} invalid onChange={() => {}} aria-label="Bio" />);
    expect(ref.current?.getAttribute('rows')).toBe('6');
  });

  it('reports the string value', () => {
    const onChange = mock((_v: string) => {});
    render(<Textarea value="" onChange={onChange} aria-label="Bio" />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'x' } });
    expect(onChange).toHaveBeenCalledWith('x');
  });
});
