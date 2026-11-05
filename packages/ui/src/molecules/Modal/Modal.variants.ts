import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Modal — Overlay + a centered card: radius-xl frame, width by size,
 * header/body/footer rows. Decoration only; behavior is all Overlay's.

 */
// @@T mol-2 begin
export const modalPanel: (props?: ({size?: 'sm' | 'md' | 'lg' | null | undefined;} & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
// @@T mol-2 end
  [
    'flex max-h-[calc(100vh-96px)] flex-col overflow-hidden',
    'bg-surface-1 border border-border-soft rounded-xl shadow-lg',
  ],
  {
    variants: {
      size: {
        sm: 'w-[min(380px,calc(100vw-48px))]',
        md: 'w-[min(480px,calc(100vw-48px))]',
        lg: 'w-[min(620px,calc(100vw-48px))]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

// @@V mol-2 begin
/** The scrolling body row. */
export const modalBody: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('overflow-y-auto p-5 text-sm leading-relaxed text-fg2');

/** The footer row holding the status slot and the actions. */
export const modalFooter: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex shrink-0 justify-end gap-2.5 border-t border-border-soft bg-surface-sunk px-5 py-3.5');

/** The footer-left status slot (ModalFooterStatus). */
export const modalFooterStatus: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('mr-auto min-w-0 truncate self-center font-mono text-[11px] text-fg3');

/** The header row Modal and Drawer share (OverlayHeader). */
export const overlayHeader: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex shrink-0 items-start gap-4 border-b border-border-soft px-5 py-[18px]');

/** The header's text column holding eyebrow and title. */
export const overlayHeaderText: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('min-w-0 flex-1');

/** The optional mono eyebrow over the title. */
export const overlayHeaderEyebrow: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('mb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-fg3');

/** The display-font title. */
export const overlayHeaderTitle: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('m-0 font-display text-[19px] font-bold tracking-[-0.01em] text-fg1');

/** The close button, merged over the inline touchable. */
export const overlayHeaderClose: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('size-8 shrink-0 justify-center bg-surface-1 border border-border-soft text-fg2');
// @@V mol-2 end

export type ModalPanelVariants = VariantProps<typeof modalPanel>;
