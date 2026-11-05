import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { FileDrop } from './FileDrop';

describe('FileDrop', () => {
  it('renders the empty drop zone with label and hint', () => {
    render(<FileDrop value={null} onChange={() => {}} label="Drop a CSV" hint="Up to 1 MB" />);
    expect(screen.getByRole('button', { name: /Drop a CSV/ })).toBeTruthy();
    expect(screen.getByText('Up to 1 MB')).toBeTruthy();
  });

  it('uses the default label', () => {
    render(<FileDrop value={null} onChange={() => {}} />);
    expect(screen.getByText('Drop a file')).toBeTruthy();
  });

  it('renders the landed file chip and removes it', () => {
    const onChange = mock((_f: File | null) => {});
    render(<FileDrop value={{ name: 'report.csv', size: 2048 }} onChange={onChange} />);
    expect(screen.getByText('report.csv')).toBeTruthy();
    expect(screen.getByText(/KB|2/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Remove file' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('renders a custom icon in the chip', () => {
    render(<FileDrop value={{ name: 'a.txt', size: 1 }} onChange={() => {}} icon={<span>ICON</span>} />);
    expect(screen.getByText('ICON')).toBeTruthy();
  });
});
