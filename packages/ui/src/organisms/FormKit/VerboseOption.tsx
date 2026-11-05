import type { ReactNode } from 'react';

import { Icon } from '../../atoms/Icon';
import { cn } from '../../lib';

import {
  verboseCap,
  verboseControl,
  verboseOption,
  // @@V org-1 begin
  verboseBadge,
  verboseDescription,
  verboseLabel,
  verboseMeta,
  verboseOptionList,
  verboseRadioDot,
  verboseText,
  verboseTitleRow,
  // @@V org-1 end
} from './FormKit.variants';

/**
 * VerboseOption / VerboseOptionList — generalized from the original design
 * ModelOption (the original AgentEditor screen; spec:
 * "ModelOption"): a rich option row — name, badge
 * slot, short description — behaving as a radio or checkbox, tinting
 * accent when selected. Deliberately NOT tied to the model use case:
 * the model picker is just `options` data.
 */

export interface VerboseOptionProps {
  /** Control semantics: exclusive pick vs independent toggle. */
  mode?: 'radio' | 'checkbox';
  selected: boolean;
  /** Radio: select me. Checkbox: toggle me. */
  onSelect?: () => void;
  /** The option's name (raw: mono semibold model id). */
  label: ReactNode;
  /**
   * Badge slot next to the name — Badges, or plain strings rendered as
   * the original capability pills ("fast", "web", "code", …).
   */
  badges?: ReactNode[];
  description?: ReactNode;
  /** Extra mono line under the description (original `verbose` cost line). */
  meta?: ReactNode;
  disabled?: boolean;
  className?: string;
}

// @@T org-1 begin
export const VerboseOption: { (props: VerboseOptionProps): import('react').JSX.Element; displayName: string } = ({
// @@T org-1 end
  mode = 'radio',
  selected,
  onSelect,
  label,
  badges,
  description,
  meta,
  disabled = false,
  className,
}: VerboseOptionProps) => (
  <button
    type="button"
    role={mode === 'radio'
      ? 'radio'
      : 'checkbox'}
    aria-checked={selected}
    disabled={disabled}
    onClick={() => onSelect?.()}
    className={cn(verboseOption({ selected }), className)}
  >
    {/* @@V org-1 begin */}
    <span className={verboseControl({ mode, selected })} aria-hidden>
      {selected && (
        mode === 'radio'
          ? <span className={verboseRadioDot()} />
          : <Icon name="check" size={11} strokeWidth={3} />
      )}
    </span>
    <span className={verboseText()}>
      <span className={verboseTitleRow()}>
        <span className={verboseLabel()}>
          {/* @@V org-1 end */}
          {label}
        </span>
        {/* @@V org-1 begin */}
        {badges?.map((badge, i) => typeof badge === 'string' || typeof badge === 'number'
          ? (
               
            <span key={i} className={verboseCap()}>{badge}</span>
          )
             
          : <span key={i} className={verboseBadge()}>{badge}</span>)}
        {/* @@V org-1 end */}
      </span>
      {/* @@V org-1 begin */}
      {description != null && (
        <span className={verboseDescription()}>
          {description}
        </span>
      )}
      {meta != null && (
        <span className={verboseMeta()}>
          {/* @@V org-1 end */}
          {meta}
        </span>
      )}
    </span>
  </button>
);

VerboseOption.displayName = 'VerboseOption';

export interface VerboseOptionData {
  value: string;
  label: ReactNode;
  badges?: ReactNode[];
  description?: ReactNode;
  meta?: ReactNode;
  disabled?: boolean;
}

interface VerboseOptionListBaseProps {
  options: VerboseOptionData[];
  ariaLabel?: string;
  className?: string;
}

export interface VerboseOptionRadioListProps
  extends VerboseOptionListBaseProps {
  mode?: 'radio';
  value: string;
  onChange: (value: string) => void;
}

export interface VerboseOptionCheckboxListProps
  extends VerboseOptionListBaseProps {
  mode: 'checkbox';
  value: string[];
  onChange: (value: string[]) => void;
}

export type VerboseOptionListProps =
  | VerboseOptionRadioListProps
  | VerboseOptionCheckboxListProps;

/** Data-driven column of VerboseOptions with the mode's group semantics. */
// @@T org-1 begin
export const VerboseOptionList: { (props: VerboseOptionListProps): import('react').JSX.Element; displayName: string } = (props: VerboseOptionListProps) => {
// @@T org-1 end
  const { options, ariaLabel, className } = props;
  const isRadio = props.mode !== 'checkbox';
  const isSelected = (v: string) => (props.mode === 'checkbox'
    ? props.value.includes(v)
    : props.value === v);
  const pick = (v: string) => {
    if (props.mode === 'checkbox') {
      props.onChange(props.value.includes(v)
        ? props.value.filter((x) => x !== v)
        : [...props.value, v]);
    } else {
      props.onChange(v);
    }
  };
  return (
    <div
      role={isRadio
        ? 'radiogroup'
        : 'group'}
      aria-label={ariaLabel}
      // @@V org-1 begin
      className={cn(verboseOptionList(), className)}
      // @@V org-1 end
    >
      {options.map((o) => (
        <VerboseOption
          key={o.value}
          mode={isRadio
            ? 'radio'
            : 'checkbox'}
          selected={isSelected(o.value)}
          onSelect={() => pick(o.value)}
          label={o.label}
          badges={o.badges}
          description={o.description}
          meta={o.meta}
          disabled={o.disabled}
        />
      ))}
    </div>
  );
};

VerboseOptionList.displayName = 'VerboseOptionList';
