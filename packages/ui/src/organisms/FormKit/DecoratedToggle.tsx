import type { ReactNode } from 'react';

import { switchThumb, switchTrack } from '../../atoms/Switch/Switch.variants';
import { cn } from '../../lib';

import {
  decoratedToggle,
  decoratedToggleDecoration,
  decoratedToggleDescription,
  decoratedToggleHeader,
  decoratedToggleHeaderDot,
  decoratedToggleList,
  decoratedToggleSwitch,
  decoratedToggleText,
  decoratedToggleTitle,
  decoratedToggleTitleRow,
} from './FormKit.variants';

/**
 * DecoratedToggle / DecoratedToggleList: bordered rows of decoration +
 * title/description + switch that tint accent when on, grouped under a
 * mono header carrying an x/y-on indicator. Not tied to one use case:
 * the same rows serve option pickers, auto-start flags and skill toggles.
 *
 * A11y note: the common pattern is a label wrapping a separate Switch (two
 * click targets, double-fire risk). Here the ROW ITSELF is the switch
 * control (`role="switch"`); the Switch atom's track/thumb cvas render
 * decoratively inside it, so there is exactly one focusable control per
 * row and the whole box is its hit area.
 */

export interface DecoratedToggleProps {
  /** Leading decoration — icon, avatar… — vertically centered. */
  decoration?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Trailing companion to the title (e.g. a "recommended" Badge). */
  meta?: ReactNode;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const DecoratedToggle: { (props: DecoratedToggleProps): import('react').JSX.Element; displayName: string } = ({
  decoration,
  title,
  description,
  meta,
  checked,
  onChange,
  disabled = false,
  className,
}: DecoratedToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange?.(!checked)}
    className={cn(decoratedToggle({ checked }), className)}
  >
    {decoration != null && (
      <span
        className={decoratedToggleDecoration({ checked })}
        aria-hidden
      >
        {decoration}
      </span>
    )}
    <span className={decoratedToggleText()}>
      <span className={decoratedToggleTitleRow()}>
        <span className={decoratedToggleTitle()}>
          {title}
        </span>
        {meta}
      </span>
      {description != null && (
        <span className={decoratedToggleDescription()}>
          {description}
        </span>
      )}
    </span>
    <span
      className={cn(switchTrack({ size: 'sm' }), decoratedToggleSwitch())}
      data-on={checked
        ? ''
        : undefined}
      aria-hidden
    >
      <span className={switchThumb({ size: 'sm' })} />
    </span>
  </button>
);

DecoratedToggle.displayName = 'DecoratedToggle';

export interface DecoratedToggleOption {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  decoration?: ReactNode;
  meta?: ReactNode;
  disabled?: boolean;
}

export interface DecoratedToggleListProps {
  /** Group name shown in the mono header. */
  title: ReactNode;
  options: DecoratedToggleOption[];
  /** Ids currently on — parent-owned. */
  value: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

/** Grouped toggles with the spec's x/y-on indicator in the header. */
export const DecoratedToggleList: { (props: DecoratedToggleListProps): import('react').JSX.Element; displayName: string } = ({
  title,
  options,
  value,
  onChange,
  className,
}: DecoratedToggleListProps) => {
  const on = options.filter((o) => value.includes(o.id)).length;
  const toggle = (id: string) => {
    onChange(value.includes(id)
      ? value.filter((x) => x !== id)
      : [...value, id]);
  };
  return (
    <div className={className}>
      <div className={decoratedToggleHeader()}>
        <span>{title}</span>
        <span className={decoratedToggleHeaderDot()}>·</span>
        <span>{on}/{options.length}</span>
      </div>
      <div className={decoratedToggleList()} role="group">
        {options.map((o) => (
          <DecoratedToggle
            key={o.id}
            decoration={o.decoration}
            title={o.title}
            description={o.description}
            meta={o.meta}
            checked={value.includes(o.id)}
            onChange={() => toggle(o.id)}
            disabled={o.disabled}
          />
        ))}
      </div>
    </div>
  );
};

DecoratedToggleList.displayName = 'DecoratedToggleList';
