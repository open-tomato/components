import { cva, type VariantProps } from 'class-variance-authority';

/**
 * SectionCard — the dashboard chart/card shell, migrated from the original design
 * `Section` in the original Shared screen (inline
 * styles, no CVA source): surface-1 card, radius-lg, soft border, an
 * optional header row (14/18 padding, divider) with display-font title +
 * small subtitle, and an 18px-padded body (`padded={false}` for
 * full-bleed lists).
 */
// @@T mol-2 begin
export const sectionCard: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
// @@T mol-2 end
  'flex flex-col overflow-hidden rounded-lg border border-border-soft bg-surface-1',
);

// @@T mol-2 begin
export const sectionCardHeader: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
// @@T mol-2 end
  'flex items-center justify-between gap-3 border-b border-border-soft bg-surface-1 px-[18px] py-3.5',
);

// @@T mol-2 begin
export const sectionCardTitle: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
// @@T mol-2 end
  'font-display text-[15px] font-bold tracking-[-0.01em] text-fg1',
);

// @@T mol-2 begin
export const sectionCardSubtitle: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('mt-0.5 text-xs text-fg3');
// @@T mol-2 end

// @@T mol-2 begin
export const sectionCardBody: (props?: ({padded?: boolean | null | undefined;} & import('class-variance-authority/types').ClassProp) | undefined) => string = cva('flex-1', {
// @@T mol-2 end
  variants: {
    padded: {
      false: 'p-0',
      true: 'p-[18px]',
    },
  },
  defaultVariants: { padded: true },
});

/** Footer line (UsageChart contract): small text, optional divider. */
// @@T mol-2 begin
export const sectionCardFooter: (props?: ({divider?: boolean | null | undefined;} & import('class-variance-authority/types').ClassProp) | undefined) => string = cva('px-[18px] pb-3.5 text-xs text-fg3', {
// @@T mol-2 end
  variants: {
    divider: {
      false: '',
      true: 'mt-0 border-t border-border-soft pt-3',
    },
  },
  defaultVariants: { divider: false },
});

export type SectionCardBodyVariants = VariantProps<typeof sectionCardBody>;
export type SectionCardFooterVariants = VariantProps<typeof sectionCardFooter>;
