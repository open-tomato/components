import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { FilesChanged } from './FilesChanged';

describe('FilesChanged', () => {
  it('renders title, totals and one row per file', async () => {
    await act(async () => {
      render(
        <FilesChanged
          files={[
            { path: 'src/a.ts', additions: 3, deletions: 0 },
            { path: 'README.md', additions: 1, deletions: 2 },
            { path: 'weird.unknownext', additions: 0, deletions: 0 },
            { path: 'x.ts', additions: 0, deletions: 0, icon: 'file-cog' },
          ]}
        />,
      );
    });
    expect(screen.getByText('Files changed')).toBeTruthy();
    expect(screen.getByText('4 files')).toBeTruthy();
    expect(screen.getByText('+4')).toBeTruthy();
    expect(screen.getAllByText('-2')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByTitle('src/a.ts').textContent).toBe('src/a.ts');
  });

  it('uses the singular label and a custom title', () => {
    render(
      <FilesChanged
        title="Touched"
        files={[{ path: 'a.json', additions: 1, deletions: 1 }]}
      />,
    );
    expect(screen.getByText('Touched')).toBeTruthy();
    expect(screen.getByText('1 file')).toBeTruthy();
  });

  it('renders an empty list', () => {
    render(<FilesChanged files={[]} />);
    expect(screen.getByText('0 files')).toBeTruthy();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
