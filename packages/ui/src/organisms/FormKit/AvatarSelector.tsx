import { useId } from 'react';

import { cn } from '../../lib';

import {
  avatarPreview,
  avatarSwatch,
  avatarInitialsInput,
  avatarSelector,
  avatarSwatchGrid,
  type AvatarSelectorTone,
} from './FormKit.variants';

/**
 * AvatarSelector: a big avatar preview, a
 * matching-width 1–2 character initials input, and a 3-column swatch
 * grid picking the background color. Controlled throughout — the parent
 * owns `initials` and `tone` (a profile form, a group form, …).
 */

export interface AvatarSelectorProps {
  /** 1–2 characters shown in the avatar; uppercased on input. */
  initials: string;
  onInitialsChange?: (initials: string) => void;
  tone: AvatarSelectorTone;
  onToneChange?: (tone: AvatarSelectorTone) => void;
  /** Allows 1 or 2 characters. */
  maxLength?: 1 | 2;
  /** Swatches offered — defaults to the full palette (6). */
  tones?: AvatarSelectorTone[];
  id?: string;
  className?: string;
}

const DEFAULT_TONES: AvatarSelectorTone[] = [
  'primary',
  'accent',
  'gold',
  'info',
  'green',
  'slate',
];

export const AvatarSelector: { (props: AvatarSelectorProps): import('react').JSX.Element; displayName: string } = ({
  initials,
  onInitialsChange,
  tone,
  onToneChange,
  maxLength = 2,
  tones = DEFAULT_TONES,
  id,
  className,
}: AvatarSelectorProps) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={cn(avatarSelector(), className)}>
      <span className={avatarPreview({ tone })} aria-hidden>
        {initials || '?'}
      </span>
      <input
        id={inputId}
        value={initials}
        maxLength={maxLength}
        aria-label="Avatar initials"
        onChange={(e) => onInitialsChange?.(
          e.target.value.toUpperCase().slice(0, maxLength),
        )}
        className={avatarInitialsInput()}
      />
      <div
        role="radiogroup"
        aria-label="Avatar color"
        className={avatarSwatchGrid()}
      >
        {tones.map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={t === tone}
            aria-label={`${t} background`}
            onClick={() => onToneChange?.(t)}
            className={avatarSwatch({ tone: t, selected: t === tone })}
          />
        ))}
      </div>
    </div>
  );
};

AvatarSelector.displayName = 'AvatarSelector';
