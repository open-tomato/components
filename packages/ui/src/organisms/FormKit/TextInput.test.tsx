import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { createRef } from 'react';

import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders a text input with its value', () => {
    render(<TextInput value="abc" onChange={() => {}} aria-label="Name" />);
    const el = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    expect(el.value).toBe('abc');
    expect(el.type).toBe('text');
  });

  it('reports the string value', () => {
    const onChange = mock((_v: string) => {});
    render(<TextInput value="" onChange={onChange} aria-label="Name" />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'z' } });
    expect(onChange).toHaveBeenCalledWith('z');
  });

  it('pads for a string prefix', () => {
    render(<TextInput value="" onChange={() => {}} prefix="@" aria-label="Handle" />);
    expect(screen.getByText('@')).toBeTruthy();
    expect((screen.getByRole('textbox') as HTMLInputElement).style.paddingLeft).toBe('19.5px');
  });

  it('renders a node prefix and a suffix', () => {
    render(
      <TextInput
        value=""
        onChange={() => {}}
        prefix={<span>PRE</span>}
        suffix={<button type="button">Show</button>}
        aria-label="Pw"
      />,
    );
    expect(screen.getByText('PRE')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Show' })).toBeTruthy();
    expect(screen.getByRole('textbox').className).toContain('pl-[34px]');
    expect(screen.getByRole('textbox').className).toContain('pr-[34px]');
  });

  it('forwards the ref and type', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput ref={ref} type="email" value="" invalid onChange={() => {}} />);
    expect(ref.current?.type).toBe('email');
  });
});
