import type { ReactNode } from 'react';

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';

import {
  checkboxBox,
  // @@V org-1 begin
  checkboxHint,
  checkboxLabel,
  checkboxMark,
  checkboxRow,
  checkboxText,
  // @@V org-1 end
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

// @@T org-1 begin
export const Checkbox: { (props: CheckboxProps): import('react').JSX.Element; displayName: string } = ({
// @@T org-1 end
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
    // @@V org-1 begin
    className={cn(
      touchable({ rounded: 'sm', noBrightness: false }),
      checkboxRow(),
      className,
    )}
    // @@V org-1 end
  >
    {/* @@V org-1 begin */}
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
    {/* @@V org-1 end */}
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

// @@T org-1 begin
export const CheckGroup: { (props: CheckGroupProps): import('react').JSX.Element; displayName: string } = ({
// @@T org-1 end
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
