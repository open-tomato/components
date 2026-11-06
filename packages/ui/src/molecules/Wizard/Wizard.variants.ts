import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Wizard — a controlled multi-step questionnaire: Overlay (portal/trap/
 * escape) + a Stepper rail + the caller's step content. `step` and
 * `answers` live in the parent; each step's validate() gates Continue.
 * No new behavior — only composition.

 */
export const wizardPanel: (props?: ClassProp) => string = cva(
  [
    'flex max-h-[calc(100vh-80px)] w-[min(560px,calc(100vw-48px))] flex-col',
    'overflow-hidden rounded-xl border border-border-soft bg-surface-1 shadow-lg',
  ],
);

export type WizardPanelVariants = VariantProps<typeof wizardPanel>;

export const wizardHeader: (props?: ClassProp) => string = cva(
  'shrink-0 border-b border-border-soft px-[22px] pb-4 pt-[18px]',
);

export const wizardBrandRow: (props?: ClassProp) => string = cva(
  'mb-4 flex items-center gap-2.5',
);

export const wizardClose: (props?: ClassProp) => string = cva(
  'ml-auto size-[30px] shrink-0 justify-center border border-border-soft bg-surface-1 text-fg2',
);

export const wizardBody: (props?: ClassProp) => string = cva(
  'flex-1 overflow-y-auto px-[22px] pb-5 pt-[22px]',
);

export const wizardTitle: (props?: ClassProp) => string = cva(
  'm-0 mb-1.5 font-display text-[22px] font-bold tracking-[-0.01em] text-fg1',
);

export const wizardBlurb: (props?: ClassProp) => string = cva(
  'm-0 mb-5 text-[13.5px] leading-relaxed text-fg2',
);

export const wizardFooter: (props?: ClassProp) => string = cva(
  'flex shrink-0 items-center gap-3 border-t border-border-soft bg-surface-sunk px-[22px] py-3.5',
);

export const wizardCounter: (props?: ClassProp) => string = cva(
  'ml-auto font-mono text-[11.5px] text-fg3',
);
