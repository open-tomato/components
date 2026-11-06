import {
  forwardRef,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../lib';

import {
  textInput,
  textInputPad,
  textInputPrefix,
  textInputSuffix,
  textInputWrap,
  type TextInputVariants,
} from './FormKit.variants';

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'>,
  TextInputVariants {
  value: string;
  onChange: (value: string) => void;
  /**
   * Leading slot. A string keeps the mono-prefix treatment ("@");
   * a ReactNode renders as a 14px leading icon slot (an icon, say).
   */
  prefix?: ReactNode;
  /** Trailing slot — interactive (the auth eye-toggle is a real button). */
  suffix?: ReactNode;
}

/** Left padding per prefix character (12 + len * 7.5). */
const PREFIX_PAD_BASE = 12;
const PREFIX_PAD_PER_CHAR = 7.5;

export const TextInput: import('react').ForwardRefExoticComponent<TextInputProps & import('react').RefAttributes<HTMLInputElement>> = forwardRef<HTMLInputElement, TextInputProps>(
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
            {suffix}
          </span>
        )}
      </span>
    );
  },
);

TextInput.displayName = 'TextInput';
