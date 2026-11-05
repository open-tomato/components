import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { CodeInput } from './CodeInput';

describe('CodeInput', () => {
  it('renders a labelled group with six cells by default', () => {
    render(<CodeInput value="" onChange={() => undefined} />);
    expect(screen.getByRole('group', { name: 'Verification code' })).toBeTruthy();
    expect(screen.getAllByRole('textbox').length).toBe(6);
  });

  it('honours length, label and value', () => {
    render(<CodeInput length={4} label="PIN" value="12" onChange={() => undefined} />);
    expect(screen.getByRole('group', { name: 'PIN' })).toBeTruthy();
    const first = screen.getByRole('textbox', { name: 'digit 1 of 4' }) as HTMLInputElement;
    expect(first.value).toBe('1');
    expect((screen.getByRole('textbox', { name: 'digit 3 of 4' }) as HTMLInputElement).value).toBe('');
  });

  it('reports a typed digit and advances focus', () => {
    const onChange = mock((_v: string) => undefined);
    render(<CodeInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'digit 1 of 6' }), {
      target: { value: '7' },
    });
    expect(onChange).toHaveBeenCalledWith('7');
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'digit 2 of 6' }));
  });

  it('strips non-digits', () => {
    const onChange = mock((_v: string) => undefined);
    render(<CodeInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'digit 1 of 6' }), {
      target: { value: 'a' },
    });
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('retreats focus on backspace in an empty cell', () => {
    render(<CodeInput value="1" onChange={() => undefined} />);
    const second = screen.getByRole('textbox', { name: 'digit 2 of 6' });
    second.focus();
    fireEvent.keyDown(second, { key: 'Backspace' });
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'digit 1 of 6' }));
  });

  it('does not retreat on backspace in a filled cell or other keys', () => {
    render(<CodeInput value="12" onChange={() => undefined} />);
    const second = screen.getByRole('textbox', { name: 'digit 2 of 6' });
    second.focus();
    fireEvent.keyDown(second, { key: 'Backspace' });
    fireEvent.keyDown(second, { key: 'a' });
    expect(document.activeElement).toBe(second);
  });

  it('renders with autoFocus', () => {
    // eslint-disable-next-line jsx-a11y/no-autofocus -- exercising the opt-in prop
    render(<CodeInput value="" onChange={() => undefined} autoFocus />);
    expect(screen.getAllByRole('textbox').length).toBe(6);
  });
});
