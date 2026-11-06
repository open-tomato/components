import { cva, type VariantProps } from 'class-variance-authority';

/**
 * OAuthButton — the provider sign-in rows above the email form (auth
 * screens). Always full-width in the auth card.
 */
export const oauthButton:
(props?: import('class-variance-authority/types').ClassProp) => string = cva([
  'inline-flex w-full cursor-pointer items-center justify-center gap-2.5',
  'rounded-md border border-border-strong bg-surface-1 px-3.5 py-[11px]',
  'font-body text-sm font-semibold text-fg1',
  'transition-colors hover:bg-surface-sunk',
]);

export type OAuthButtonVariants = VariantProps<typeof oauthButton>;

/** Provider glyph: never shrinks inside the button row. */
export const providerGlyph: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('shrink-0');
