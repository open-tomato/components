import { cva, type VariantProps } from 'class-variance-authority';

/**
 * PasskeyPrompt — the post-"add passkey" waiting state (original design
 * the original Profile screen PasskeyPrompt, shown by the 2FA modal while the
 * browser's WebAuthn interaction is pending; decision D5). The pulsing
 * ring reuses the theme's pulseRing keyframes (animate-pulse-ring).
 */
export const passkeyPromptIndicator: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva([
  'flex size-[72px] items-center justify-center rounded-full',
  'bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-accent',
  'animate-pulse-ring motion-reduce:animate-none',
]);

export const passkeyPrompt: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
  'flex flex-col items-center gap-4 py-4 text-center',
);

/** The copy column, capped at 380px. */
export const passkeyPromptCopy: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('max-w-[380px]');

/** The display-font title line. */
export const passkeyPromptTitle: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('mb-1.5 font-display text-lg font-bold text-fg1');

/** The instruction copy under the title. */
export const passkeyPromptDescription: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('text-[13px] leading-[1.55] text-fg2');

export type PasskeyPromptVariants = VariantProps<typeof passkeyPrompt>;
