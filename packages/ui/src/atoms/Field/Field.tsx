import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

import { cn } from '../../lib';

import {
  field,
  fieldControl,
  fieldHelper,
  fieldIcon,
  fieldIconPad,
  fieldLabel,
  fieldRoot,
  type FieldVariants,
} from './Field.variants';

export interface FieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'disabled'>,
  FieldVariants {
  /** Label rendered above the control, linked via htmlFor. */
  label?: string;
  /** Helper line under the control; colored by the state variant. */
  helper?: string;
  /** Optional leading icon inside the control (15px). */
  icon?: ReactNode;
}

export const Field: ForwardRefExoticComponent<
  FieldProps & RefAttributes<HTMLInputElement>
> = forwardRef<
  HTMLInputElement, FieldProps>(
  ({ className, state, size, label, helper, icon, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <div
        className={cn(fieldRoot({ disabled: state === 'disabled' }), className)}
      >
        {label != null && (
          <label
            htmlFor={inputId}
            className={fieldLabel()}
          >
            {label}
          </label>
        )}
        <span className={fieldControl()}>
          {icon != null && (
            <span className={fieldIcon()}>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={state === 'disabled'}
            className={cn(field({ state, size }), fieldIconPad({ icon: icon != null }))}
            {...props}
          />
        </span>
        {helper != null && (
          <span className={fieldHelper({ state })}>{helper}</span>
        )}
      </div>
    );
  },
);

Field.displayName = 'Field';
