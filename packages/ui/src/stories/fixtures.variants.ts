import type { ClassProp } from 'class-variance-authority/types';

import { cva } from 'class-variance-authority';

/** The `Ph` placeholder pill's base: a dimmed 12px rounded bar. */
export const ph: (props?: ClassProp) => string = cva(
  'block h-[12px] rounded-full bg-border-strong opacity-50',
);

/**
 * The size and colour a demo filler gives one `Ph`, merged over the base
 * through Ph's className: `logo`/`title`/`line*` in ShellFiller,
 * `heading`/`body*` in CardFiller.
 */
export const phShape: (
  props?: {
    shape?:
      | 'logo'
      | 'title'
      | 'line'
      | 'lineShort'
      | 'lineLong'
      | 'heading'
      | 'body'
      | 'bodyLong'
      | null
      | undefined;
  } & ClassProp,
) => string = cva('', {
  variants: {
    shape: {
      logo: 'w-[26px] h-[26px] rounded-[8px] bg-primary opacity-90',
      title: 'w-[120px] h-[14px] bg-fg2',
      line: 'w-full h-[10px]',
      lineShort: 'w-[78%] h-[10px]',
      lineLong: 'w-[90%] h-[10px]',
      heading: 'w-[70%] h-[12px] bg-fg2',
      body: 'w-full h-[9px]',
      bodyLong: 'w-[85%] h-[9px]',
    },
  },
});

/** ShellFiller's column of rows. */
export const shellFiller: (props?: ClassProp) => string = cva('flex flex-col gap-3.5');

/** ShellFiller's header row: logo pill beside the title pill. */
export const shellFillerHeader: (props?: ClassProp) => string = cva(
  'flex items-center gap-2.5',
);

/** CardFiller's column of text rows. */
export const cardFiller: (props?: ClassProp) => string = cva('flex flex-col gap-2');

/** A tinted `item N` tile from the Content demo, one tone per brand colour. */
export const contentTile: (
  props?: {
    tone?: 'primary' | 'accent' | 'gold' | null | undefined;
  } & ClassProp,
) => string = cva(
  'border rounded-md px-4 py-3 font-mono font-semibold text-[13px] whitespace-nowrap',
  {
    variants: {
      tone: {
        primary:
          'bg-[color-mix(in_oklab,var(--primary)_16%,var(--surface-1))] border-[color-mix(in_oklab,var(--primary)_40%,transparent)] text-primary',
        accent:
          'bg-[color-mix(in_oklab,var(--accent)_16%,var(--surface-1))] border-[color-mix(in_oklab,var(--accent)_40%,transparent)] text-accent',
        gold:
          'bg-[color-mix(in_oklab,var(--gold-500)_16%,var(--surface-1))] border-[color-mix(in_oklab,var(--gold-500)_40%,transparent)] text-gold-500',
      },
    },
  },
);

/** A numbered neutral tile from the Grid demo. */
export const gridTile: (props?: ClassProp) => string = cva(
  'h-[56px] rounded-md bg-surface-1 border border-border-soft flex items-center justify-center text-fg3 font-mono text-xs',
);
