import type { ReactNode } from 'react';

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';

// @@V org-1 begin
import {
  radioCircle,
  radioDot,
  radioGroup,
  radioHint,
  radioLabel,
  radioOption,
  radioText,
} from './FormKit.variants';
// @@V org-1 end

export interface RadioOption {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

// @@T org-1 begin
export const RadioGroup: { (props: RadioGroupProps): import('react').JSX.Element; displayName: string } = ({
// @@T org-1 end
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: RadioGroupProps) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    // @@V org-1 begin
    className={cn(radioGroup(), className)}
    // @@V org-1 end
  >
    {options.map((o) => {
      const on = value === o.value;
      return (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange(o.value)}
          className={cn(
            touchable({ rounded: 'md', noBrightness: false }),
            radioOption({ checked: on }),
          )}
        >
          {/* @@V org-1 begin */}
          <span className={radioCircle({ checked: on })}>
            {on && <span className={radioDot()} />}
          </span>
          <span className={radioText()}>
            <span className={radioLabel()}>
              {o.label}
            </span>
            {o.hint != null && (
              <span className={radioHint()}>{o.hint}</span>
            )}
          </span>
          {/* @@V org-1 end */}
        </button>
      );
    })}
  </div>
);

RadioGroup.displayName = 'RadioGroup';
