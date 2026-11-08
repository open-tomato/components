import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Banner / Alert — inline, persistent status in the flow of the page. Tone
 * drives color and icon together; dismiss and an action slot are optional.
 *
 * Fills use the softer `*-wash` tier the feedback surfaces share.
 */
export const banner: (props?: ({ tone?: 'info' | 'success' | 'danger' | 'neutral' | 'warning' | null | undefined; } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva('flex gap-3 rounded-md border px-[15px] py-[13px]', {

  variants: {
    tone: {
      success: 'bg-success-wash border-success-tint',
      warning: 'bg-warning-wash border-warning-tint',
      danger: 'bg-danger-wash border-danger-tint',
      info: 'bg-info-wash border-info-tint',
      neutral: 'bg-neutral-wash border-neutral-tint',
    },
  },
  defaultVariants: { tone: 'info' },
});

/** Tone color for the leading icon. */
export const bannerIcon: (props?: ({ tone?: 'info' | 'success' | 'danger' | 'neutral' | 'warning' | null | undefined; } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva('mt-px shrink-0', {

  variants: {
    tone: {
      success: 'text-success',
      warning: 'text-gold-500',
      danger: 'text-danger',
      info: 'text-info',
      neutral: 'text-fg3',
    },
  },
  defaultVariants: { tone: 'info' },
});

/** The optional tone-colored action button. */
export const bannerAction: (props?: ({ tone?: 'info' | 'success' | 'danger' | 'neutral' | 'warning' | null | undefined; } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(

  'self-center shrink-0 rounded-md border bg-surface-1 px-3 py-1.5 text-[12.5px] font-semibold',
  {
    variants: {
      tone: {
        success: 'text-success border-success-tint',
        warning: 'text-gold-500 border-warning-tint',
        danger: 'text-danger border-danger-tint',
        info: 'text-info border-info-tint',
        neutral: 'text-fg2 border-neutral-tint',
      },
    },
    defaultVariants: { tone: 'info' },
  },
);

/** The text column holding title and body. */
export const bannerContent: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('min-w-0 flex-1');

/** The optional bold title line. */
export const bannerTitle: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('mb-0.5 text-[13.5px] font-bold text-fg1');

/** The body copy under the title. */
export const bannerBody: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('text-[13px] leading-normal text-fg2');

/** The dismiss button, merged over the inline touchable. */
export const bannerDismiss: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('size-[26px] shrink-0 justify-center self-start border-none bg-transparent text-fg3');

/** The tone icon's svg, shared by Banner and Toast through ToneIcon. */
export const toneIcon: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('shrink-0');

export type BannerVariants = VariantProps<typeof banner>;
