import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '../../lib';
import { touchableVariants } from '../../particles/touchable';

import {
  switchTrack,
  switchThumb,
  type SwitchVariants,
} from './Switch.variants';

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange'>,
  SwitchVariants {
  checked?: boolean;
  /** Called with the next checked state. */
  onChange?: (checked: boolean) => void;
}

export const Switch:
import('react').ForwardRefExoticComponent<SwitchProps & import('react').RefAttributes<HTMLButtonElement>> = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size, tone, checked = false, onChange, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      data-on={checked
        ? ''
        : undefined}
      onClick={() => onChange?.(!checked)}
      className={cn(
        touchableVariants({ inline: true, rounded: 'full', noBrightness: false }),
        switchTrack({ size, tone }),
        className,
      )}
      {...props}
    >
      <span className={switchThumb({ size })} aria-hidden />
    </button>
  ),
);

Switch.displayName = 'Switch';
