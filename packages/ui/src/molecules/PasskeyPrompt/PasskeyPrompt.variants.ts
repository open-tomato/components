import { cva, type VariantProps } from 'class-variance-authority';

/**
 * PasskeyPrompt — the post-"add passkey" waiting state (original design
 * the original Profile screen PasskeyPrompt, shown by the 2FA modal while the
 * browser's WebAuthn interaction is pending; decision D5). The pulsing
 * ring reuses the theme's pulseRing keyframes (animate-pulse-ring).
 */
// @@T mol-2 begin
export const passkeyPromptIndicator: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva([
// @@T mol-2 end
  'flex size-[72px] items-center justify-center rounded-full',
  'bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-accent',
  'animate-pulse-ring motion-reduce:animate-none',
]);

// @@T mol-2 begin
export const passkeyPrompt: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
// @@T mol-2 end
  'flex flex-col items-center gap-4 py-4 text-center',
);

export type PasskeyPromptVariants = VariantProps<typeof passkeyPrompt>;
