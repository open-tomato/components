import { useQueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { QueryProvider } from './provider';

const Probe = ({ onClient }: { onClient: (c: unknown) => void }) => {
  onClient(useQueryClient());
  const opts = useQueryClient().getDefaultOptions().queries;
  return <p>{`stale ${opts?.staleTime} retry ${opts?.retry}`}</p>;
};

describe('QueryProvider', () => {
  it('provides a client with the library defaults', () => {
    render(
      <QueryProvider>
        <Probe onClient={() => {}} />
      </QueryProvider>,
    );
    expect(screen.getByText('stale 30000 retry 1')).toBeTruthy();
  });

  it('reuses one browser client across providers', () => {
    const seen: unknown[] = [];
    const tree = (
      <QueryProvider>
        <Probe onClient={(c) => seen.push(c)} />
      </QueryProvider>
    );
    const first = render(tree);
    first.unmount();
    render(tree);
    expect(seen.length).toBeGreaterThan(1);
    expect(seen.every((c) => c === seen[0])).toBe(true);
  });
});
