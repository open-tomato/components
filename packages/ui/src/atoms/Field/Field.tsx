// @@T ato-3 begin
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
// @@T ato-3 end

import { cn } from '../../lib';

// @@V ato-3 begin
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
// @@V ato-3 end

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

// @@T ato-3 begin
export const Field: ForwardRefExoticComponent<
  FieldProps & RefAttributes<HTMLInputElement>
> = forwardRef<
// @@T ato-3 end
  HTMLInputElement, FieldProps>(
  ({ className, state, size, label, helper, icon, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <div
        // @@V ato-3 begin
        className={cn(fieldRoot({ disabled: state === 'disabled' }), className)}
        // @@V ato-3 end
      >
        {label != null && (
          <label
            htmlFor={inputId}
            // @@V ato-3 begin
            className={fieldLabel()}
            // @@V ato-3 end
          >
            {label}
          </label>
        )}
        {/* @@V ato-3 begin */}
        <span className={fieldControl()}>
          {icon != null && (
            <span className={fieldIcon()}>
              {/* @@V ato-3 end */}
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={state === 'disabled'}
            // @@V ato-3 begin
            className={cn(field({ state, size }), fieldIconPad({ icon: icon != null }))}
            // @@V ato-3 end
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
