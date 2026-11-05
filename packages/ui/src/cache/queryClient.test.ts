import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'bun:test';

import { defaultQueryClient } from './queryClient';

describe('defaultQueryClient', () => {
  it('is a shared QueryClient instance', async () => {
    expect(defaultQueryClient).toBeInstanceOf(QueryClient);
    const again = (await import('./queryClient')).defaultQueryClient;
    expect(again).toBe(defaultQueryClient);
  });
});
