import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { AvatarSelector } from './AvatarSelector';

describe('AvatarSelector', () => {
  it('renders initials, the input and all six default swatches', () => {
    render(<AvatarSelector initials="AB" tone="gold" />);
    expect((screen.getByRole('textbox', { name: 'Avatar initials' }) as HTMLInputElement).value).toBe('AB');
    expect(screen.getAllByRole('radio')).toHaveLength(6);
    expect(screen.getByRole('radio', { name: 'gold background' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'info background' }).getAttribute('aria-checked')).toBe('false');
  });

  it('shows a placeholder glyph when initials are empty', () => {
    render(<AvatarSelector initials="" tone="primary" />);
    expect(screen.getByText('?')).toBeTruthy();
  });

  it('uppercases and truncates typed initials', () => {
    const onInitialsChange = mock((_v: string) => {});
    render(<AvatarSelector initials="" tone="primary" maxLength={1} onInitialsChange={onInitialsChange} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Avatar initials' }), { target: { value: 'xy' } });
    expect(onInitialsChange).toHaveBeenCalledWith('X');
  });

  it('reports the picked tone and honours a custom tone list', () => {
    const onToneChange = mock((_t: string) => {});
    render(<AvatarSelector initials="A" tone="primary" tones={['primary', 'green']} onToneChange={onToneChange} />);
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    fireEvent.click(screen.getByRole('radio', { name: 'green background' }));
    expect(onToneChange).toHaveBeenCalledWith('green');
  });
});
