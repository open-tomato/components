import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Disclosure — Accordion and Tabs are one state machine ("which ids are
 * open?"); only the selection rule and the chrome differ. Radix owns the
 * machine (Accordion single/multiple, Tabs = single that never empties);
 * these variants are the shared chrome.
 */
export const disclosureFrame: (props?: ClassProp) => string = cva(
  'overflow-hidden rounded-lg border border-border-soft bg-surface-1',
);

export const accordionTrigger: (props?: ClassProp) => string = cva(
  [
    'flex w-full cursor-pointer items-center gap-3 px-[17px] py-[15px] text-left',
    'bg-transparent data-[state=open]:bg-surface-sunk',
  ],
);

export const tabsList: (props?: ClassProp) => string = cva(
  'flex gap-0.5 border-b border-border-soft bg-surface-sunk px-2 pt-1.5',
);

export const tabsTrigger: (props?: ClassProp) => string = cva(
  [
    'inline-flex items-center gap-[7px] rounded-t-md px-3.5 py-[9px] text-[13.5px]',
    '-mb-px border-b-2 cursor-pointer',
    'text-fg3 font-medium border-transparent [&_svg]:text-fg3',
    'data-[state=active]:bg-surface-1 data-[state=active]:text-fg1',
    'data-[state=active]:font-bold data-[state=active]:border-primary',
    'data-[state=active]:[&_svg]:text-primary',
  ],
);

/** An accordion item's row, divided from the next one. */
export const accordionItem: (props?: ClassProp | undefined) => string = cva('border-b border-border-soft last:border-b-0');

/** The heading wrapping an accordion trigger. */
export const accordionHeading: (props?: ClassProp | undefined) => string = cva('m-0');

/** The group hook the trigger's chevron reads its open state from. */
export const accordionTriggerGroup: (props?: ClassProp | undefined) => string = cva('group');

/** The accordion trigger's title text. */
export const accordionTitle: (props?: ClassProp | undefined) => string = cva('min-w-0 flex-1 text-[14.5px] font-semibold text-fg1');

/** The chevron that turns when its item opens. */
export const accordionChevron: (props?: ClassProp | undefined) => string = cva('shrink-0 text-fg3 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary');

/** The collapsing content region of an accordion item. */
export const accordionContent: (props?: ClassProp | undefined) => string = cva('overflow-hidden');

/** The body text inside an accordion item. */
export const accordionBody: (props?: ClassProp | undefined) => string = cva('m-0 px-[17px] pb-4 text-[13.5px] leading-relaxed text-fg2');

/** The panel of one tab. */
export const tabsContent: (props?: ClassProp | undefined) => string = cva('min-h-24 px-[18px] pb-5 pt-[18px] outline-none');

export type DisclosureFrameVariants = VariantProps<typeof disclosureFrame>;
