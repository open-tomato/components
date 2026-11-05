import type { ReactNode } from 'react';

import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';

// @@V org-1 begin
import {
  formField,
  formFieldError,
  formFieldHint,
  formFieldLabel,
  formFieldLabelRow,
  formFieldRequired,
} from './FormKit.variants';
// @@V org-1 end

export interface FormFieldProps {
  label?: ReactNode;
  /** Right-aligned companion on the label row (auth's "Forgot?" link). */
  labelEnd?: ReactNode;
  /** Shown under the control when there's no error. */
  hint?: ReactNode;
  /**
   * 'above' renders the hint between label and control — the auth screens'
   * layout (the original Shared screen Field). Default
   * 'below' keeps the original form-kit chapter's placement.
   */
  hintPlacement?: 'below' | 'above';
  /** Replaces the below-hint and turns the message danger-toned. */
  error?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * The shared envelope — Field is to inputs what Touchable is to buttons:
 * it owns labelling, the hint/error slot and the controlled-value posture,
 * so no control re-implements them. Swap the control in the middle and
 * everything else comes along unchanged (the original form-controls demo).
 */
// @@T org-1 begin
export const FormField: { (props: FormFieldProps): import('react').JSX.Element; displayName: string } = ({
// @@T org-1 end
  label,
  labelEnd,
  hint,
  hintPlacement = 'below',
  error,
  htmlFor,
  required,
  className,
  children,
}: FormFieldProps) => (
  // @@V org-1 begin
  <div className={cn(formField(), className)}>
    {(label != null || labelEnd != null) && (
      <span className={formFieldLabelRow()}>
        <label
          htmlFor={htmlFor}
          className={formFieldLabel()}
        >
          {label}
          {required && <span className={formFieldRequired()}>*</span>}
        </label>
        {labelEnd}
      </span>
    )}
    {hintPlacement === 'above' && hint != null && (
      <span className={formFieldHint({ placement: 'above' })}>{hint}</span>
    )}
    {children}
    {error != null
      ? (
        <span className={formFieldError()}>
          <StrokeIcon name="alertTriangle" size={13} />
          {error}
        </span>
      )
      : (
        hintPlacement === 'below' &&
      hint != null && <span className={formFieldHint({ placement: 'below' })}>{hint}</span>
      )}
  </div>
  // @@V org-1 end
);

FormField.displayName = 'FormField';
