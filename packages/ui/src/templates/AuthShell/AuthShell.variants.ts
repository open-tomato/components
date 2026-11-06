import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * AuthShell — the pre-authentication shell: centred card on a softly
 * tinted backdrop, brand slot on top, footer line below.
 * Card widths: 440 default, 500 group pick, 520 the 2FA flow.
 */
export const authShell: (props?: ClassProp) => string = cva([
  'relative flex min-h-[660px] w-full flex-col items-center bg-bg px-6 py-10',
  'bg-[radial-gradient(circle_at_16%_8%,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_30%),radial-gradient(circle_at_84%_92%,color-mix(in_oklab,var(--primary)_6%,transparent),transparent_32%)]',
]);

export const authCard: (
  props?: {
    width?: 'md' | 'lg' | 'xl' | null | undefined;
  } & ClassProp,
) => string = cva(
  [
    'flex w-full flex-col gap-[18px]',
    'rounded-xl border border-border-soft bg-surface-2 p-8 shadow-md',
  ],
  {
    variants: {
      width: {
        md: 'max-w-[440px]',
        lg: 'max-w-[500px]',
        xl: 'max-w-[520px]',
      },
    },
    defaultVariants: { width: 'md' },
  },
);

export const authEyebrow: (props?: ClassProp) => string = cva(
  'font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent',
);

export const authFooter: (props?: ClassProp) => string = cva(
  'mt-[18px] flex items-center gap-1.5 text-[13px] text-fg3',
);

/** AuthHeading's display title. */
export const authHeadingTitle: (props?: ClassProp) => string = cva(
  '!m-0 font-display !text-[26px] font-bold !tracking-[-0.02em] !leading-[normal] text-balance text-fg1',
);

/** AuthHeading's supporting line under the title. */
export const authHeadingSub: (props?: ClassProp) => string = cva(
  'mt-1.5 text-sm leading-normal text-pretty text-fg2',
);

/** The brand slot's wrapper: caller content in a row above the card. */
export const authBrand: (props?: ClassProp) => string = cva(
  'mb-6 inline-flex items-center gap-2.5 text-inherit !no-underline',
);

export type AuthCardVariants = VariantProps<typeof authCard>;
