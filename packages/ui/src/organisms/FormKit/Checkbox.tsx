import type { ReactNode } from 'react';

import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';
import { touchableVariants } from '../../particles/touchable';

import {
  checkboxBox,
  checkboxHint,
  checkboxLabel,
  checkboxMark,
  checkboxRow,
  checkboxText,
  checkGroup,
  type CheckGroupVariants,
} from './FormKit.variants';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  hint?: ReactNode;
  className?: string;
}

export const Checkbox: { (props: CheckboxProps): import('react').JSX.Element; displayName: string } = ({
  checked,
  onChange,
  label,
  hint,
  className,
}: CheckboxProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={cn(
      touchableVariants({ rounded: 'sm', noBrightness: false }),
      checkboxRow(),
      className,
    )}
  >
    <span className={checkboxBox({ checked })}>
      {checked && (
        <span className={checkboxMark()}>
          <StrokeIcon name="check" size={13} />
        </span>
      )}
    </span>
    <span className={checkboxText()}>
      <span className={checkboxLabel()}>{label}</span>
      {hint != null && (
        <span className={checkboxHint()}>{hint}</span>
      )}
    </span>
  </button>
);

Checkbox.displayName = 'Checkbox';

export interface CheckOption {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
}

export interface CheckGroupProps extends CheckGroupVariants {
  options: CheckOption[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export const CheckGroup: { (props: CheckGroupProps): import('react').JSX.Element; displayName: string } = ({
  options,
  value,
  onChange,
  columns,
  className,
}: CheckGroupProps) => {
  const toggle = (v: string) => onChange(
    value.includes(v)
      ? value.filter((x) => x !== v)
      : [...value, v],
  );
  return (
    <div className={cn(checkGroup({ columns }), className)}>
      {options.map((o) => (
        <Checkbox
          key={o.value}
          checked={value.includes(o.value)}
          onChange={() => toggle(o.value)}
          label={o.label}
          hint={o.hint}
        />
      ))}
    </div>
  );
};

CheckGroup.displayName = 'CheckGroup';
