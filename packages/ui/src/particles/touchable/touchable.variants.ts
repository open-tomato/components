import type { VariantsConfig, VariantsFunction } from '../../lib/extendVariants';

import { cva, type VariantProps } from 'class-variance-authority';

type TouchableSchema = {
  inline: Record<'false' | 'true', string>;
  stretch: Record<'false' | 'true', string>;
  noBrightness: Record<'false' | 'true', string>;
  rounded: Record<'none' | 'sm' | 'md' | 'lg' | 'full', string>;
};

/**
 * Touchable — the interaction-only blueprint (no fill, no chrome): cursor,
 * press scale, focus ring and the disabled state. Decoration is supplied by
 * whatever composes it (Button, Chip, NavItem, …).
 *
 * The config is exported next to the cva function, because cva 0.7.1 does
 * not expose a function's config: `extendVariants(touchableConfig, …)`
 * builds a component's variants over this one.
 */
export const touchableConfig: VariantsConfig<TouchableSchema> = {
  base: [
    'relative cursor-pointer select-none items-center',
    'transition-[transform,filter] active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-leaf focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  variants: {
    inline: { false: 'flex', true: 'inline-flex' },
    stretch: { false: 'justify-start', true: 'justify-stretch w-full' },
    noBrightness: { false: 'hover:brightness-105', true: 'hover:brightness-100' },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    inline: false,
    stretch: false,
    noBrightness: true,
    rounded: 'md',
  },
};

/** The touchable trait as a cva function, mixed into a component's own `cn(...)`. */
export const touchableVariants: VariantsFunction<TouchableSchema> = cva(touchableConfig.base, touchableConfig);

export type TouchableVariants = VariantProps<typeof touchableVariants>;
