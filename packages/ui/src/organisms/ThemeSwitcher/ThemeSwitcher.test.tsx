import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';
import { useState } from 'react';

import { ThemeSwitcher, type ThemeName } from './ThemeSwitcher';

afterEach(cleanup);

describe('ThemeSwitcher', () => {
  it('offers the switch to dark in light theme', () => {
    render(<ThemeSwitcher theme="light" />);
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeTruthy();
  });

  it('offers the switch to light in dark theme', () => {
    render(<ThemeSwitcher theme="dark" />);
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeTruthy();
  });

  it('calls onToggle with the theme to switch to', () => {
    const onToggle = mock((_next: ThemeName) => {});
    render(<ThemeSwitcher theme="light" onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith('dark');
  });

  it('does not throw on click without onToggle', () => {
    render(<ThemeSwitcher theme="dark" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('round-trips when controlled', () => {
    const Demo = () => {
      const [theme, setTheme] = useState<ThemeName>('light');
      return <ThemeSwitcher theme={theme} onToggle={setTheme} />;
    };
    render(<Demo />);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeTruthy();
  });

  it('renders nothing when preference is system', () => {
    render(<ThemeSwitcher theme="light" preference="system" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('applies className', () => {
    render(<ThemeSwitcher theme="light" className="custom-x" />);
    expect(screen.getByRole('button').className).toContain('custom-x');
  });
});
