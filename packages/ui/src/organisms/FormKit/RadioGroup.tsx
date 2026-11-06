import type { ReactNode } from 'react';

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';

import {
  radioCircle,
  radioDot,
  radioGroup,
  radioHint,
  radioLabel,
  radioOption,
  radioText,
} from './FormKit.variants';

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

export const RadioGroup: { (props: RadioGroupProps): import('react').JSX.Element; displayName: string } = ({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: RadioGroupProps) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    className={cn(radioGroup(), className)}
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
        </button>
      );
    })}
  </div>
);

RadioGroup.displayName = 'RadioGroup';
