// @@T mol-3 begin
import type { ClassProp } from 'class-variance-authority/types';
// @@T mol-3 end

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * FilesChanged — table-like card listing changed files with +/- counts.
 * Spec-driven ("FilesChanged" — no design
 * artboard); chrome mirrors the original-design Section rows (mono paths, soft
 * row rhythm).
 */
// @@T mol-3 begin
export const filesChangedSummary: (props?: { kind?: 'additions' | 'deletions' | 'count' | null | undefined } & ClassProp) => string = cva('font-mono text-xs', {
// @@T mol-3 end

  variants: {
    kind: {
      additions: 'font-semibold text-success',
      deletions: 'font-semibold text-danger',
      count: 'text-fg3',
    },
  },
  defaultVariants: { kind: 'count' },
});

// @@T mol-3 begin
export const filesChangedPath: (props?: ClassProp) => string = cva(
// @@T mol-3 end
  'min-w-0 flex-1 truncate font-mono text-xs text-fg1',
);

// @@T mol-3 begin
export const filesChangedDelta: (props?: { kind?: 'additions' | 'deletions' | null | undefined; zero?: boolean | null | undefined } & ClassProp) => string = cva('text-right font-mono text-xs', {
// @@T mol-3 end

  variants: {
    kind: {
      additions: 'text-success',
      deletions: 'text-danger',
    },
    zero: {
      false: '',
      true: 'opacity-50',
    },
  },
  defaultVariants: { zero: false },
});

export type FilesChangedDeltaVariants = VariantProps<typeof filesChangedDelta>;
