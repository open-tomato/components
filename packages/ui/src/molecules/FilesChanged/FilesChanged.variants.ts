import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * FilesChanged — table-like card listing changed files with +/- counts.
 * Spec-driven ("FilesChanged" — no design
 * artboard); chrome mirrors the original-design Section rows (mono paths, soft
 * row rhythm).
 */
export const filesChangedSummary: (props?: { kind?: 'additions' | 'deletions' | 'count' | null | undefined } & ClassProp) => string = cva('font-mono text-xs', {

  variants: {
    kind: {
      additions: 'font-semibold text-success',
      deletions: 'font-semibold text-danger',
      count: 'text-fg3',
    },
  },
  defaultVariants: { kind: 'count' },
});

export const filesChangedPath: (props?: ClassProp) => string = cva(
  'min-w-0 flex-1 truncate font-mono text-xs text-fg1',
);

export const filesChangedDelta: (props?: { kind?: 'additions' | 'deletions' | null | undefined; zero?: boolean | null | undefined } & ClassProp) => string = cva('text-right font-mono text-xs', {

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

/** The header's count + totals row. */
export const filesChangedTotals: (props?: ClassProp | undefined) => string = cva('flex items-baseline gap-3');

/** The divided list of changed files. */
export const filesChangedList: (props?: ClassProp | undefined) => string = cva('divide-y divide-border-soft');

/** One changed file's row. */
export const filesChangedRow: (props?: ClassProp | undefined) => string = cva('flex items-center gap-2.5 px-[18px] py-2');

/** The file-type glyph at the start of a row. */
export const filesChangedIcon: (props?: ClassProp | undefined) => string = cva('shrink-0 text-fg3');

export type FilesChangedDeltaVariants = VariantProps<typeof filesChangedDelta>;
