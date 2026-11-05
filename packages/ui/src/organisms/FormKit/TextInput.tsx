import {
  forwardRef,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../lib';

// @@V org-1 begin
import {
  textInput,
  textInputPad,
  textInputPrefix,
  textInputSuffix,
  textInputWrap,
  type TextInputVariants,
} from './FormKit.variants';
// @@V org-1 end

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'>,
  TextInputVariants {
  value: string;
  onChange: (value: string) => void;
  /**
   * Leading slot. A string keeps the original demo's mono-prefix treatment ("@");
   * a ReactNode renders as a 14px leading icon slot — extension sourced from
   * the auth screens (the original Auth screen), not the
   * original form-kit chapter.
   */
  prefix?: ReactNode;
  /** Trailing slot — interactive (the auth eye-toggle is a real button). */
  suffix?: ReactNode;
}

/** Left padding per prefix character (the original demo's 12 + len * 7.5). */
const PREFIX_PAD_BASE = 12;
const PREFIX_PAD_PER_CHAR = 7.5;

// @@T org-1 begin
export const TextInput: import('react').ForwardRefExoticComponent<TextInputProps & import('react').RefAttributes<HTMLInputElement>> = forwardRef<HTMLInputElement, TextInputProps>(
// @@T org-1 end
  ({ className, value, onChange, invalid, prefix, suffix, type = 'text', ...props }, ref) => {
    const stringPrefix = typeof prefix === 'string'
      ? prefix
      : null;
    const style: CSSProperties | undefined =
      stringPrefix != null
        ? {
          paddingLeft: PREFIX_PAD_BASE + stringPrefix.length * PREFIX_PAD_PER_CHAR,
        }
        : undefined;
    return (
      // @@V org-1 begin
      <span className={textInputWrap()}>
        {stringPrefix != null && (
          <span className={textInputPrefix({ kind: 'text' })}>
            {stringPrefix}
          </span>
        )}
        {prefix != null && stringPrefix == null && (
          <span className={textInputPrefix({ kind: 'icon' })}>
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            textInput({ invalid }),
            textInputPad({
              iconPrefix: prefix != null && stringPrefix == null,
              suffix: suffix != null,
            }),
            className,
          )}
          style={style}
          {...props}
        />
        {suffix != null && (
          <span className={textInputSuffix()}>
            {/* @@V org-1 end */}
            {suffix}
          </span>
        )}
      </span>
    );
  },
);

TextInput.displayName = 'TextInput';
