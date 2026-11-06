import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Toast — the same tones as Banner, but transient and on dark chrome.
 *
 * The transient lifecycle (auto-dismiss + enter/leave motion) is
 * deferred to the motion pass — v1 is controlled: render it while it
 * should show.
 */
export const toast: (props?: ({floating?: boolean | null | undefined;} & import('class-variance-authority/types').ClassProp) | undefined) => string =
  cva(
    [
      'inline-flex items-center gap-2.5 rounded-md border px-3.5 py-[11px]',
      'bg-char-800 text-cream-50 border-char-500 shadow-lg',
      'min-w-[248px] text-[13px] font-medium',
    ],
    {
      variants: {
      /** overlay-core's Toast floats bottom-center above everything. */
        floating: {
          false: '',
          true: 'fixed bottom-6 left-1/2 -translate-x-1/2 z-toast',
        },
      },
      defaultVariants: { floating: false },
    },
  );

/** Tone color for the leading icon (reads fine on the dark chrome). */
export const toastIcon: (props?: ({tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | null | undefined;} & import('class-variance-authority/types').ClassProp) | undefined) => string =
  cva('shrink-0', {
    variants: {
      tone: {
        success: 'text-success',
        warning: 'text-gold-400',
        danger: 'text-danger',
        info: 'text-info',
        neutral: 'text-cream-300',
      },
    },
    defaultVariants: { tone: 'success' },
  });

/** The message text, filling the row between icon and dismiss. */
export const toastBody: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex-1');

/** The dismiss button, merged over the inline touchable. */
export const toastClose: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('size-[22px] shrink-0 justify-center border-none bg-transparent text-cream-300');

export type ToastVariants = VariantProps<typeof toast> &
  VariantProps<typeof toastIcon>;
