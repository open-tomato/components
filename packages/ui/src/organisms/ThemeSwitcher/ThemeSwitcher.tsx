// @@T org-2 begin
import type { FC } from 'react';
// @@T org-2 end

import { Icon } from '../../atoms/Icon';
import { IconButton } from '../../atoms/IconButton';

export type ThemeName = 'light' | 'dark';

export interface ThemeSwitcherProps {
  /** Current theme — controlled by the app's theme provider. */
  theme: ThemeName;
  /** Called with the theme to switch TO. */
  onToggle?: (next: ThemeName) => void;
  /**
   * The user's settings preference. When it is `system`, the switcher is
   * hidden entirely (app-shell spec: Top Bar) — the OS drives the
   * theme and a manual toggle would fight it.
   */
  preference?: ThemeName | 'system';
  className?: string;
}

/**
 * ThemeSwitcher (the original topbar screen header toggle; app-shell spec: Top
 * Bar): a ghost IconButton flipping dark/light — moon glyph in light
 * (switch to dark), sun in dark. Renders nothing when the user
 * preference is "system".
 */
// @@T org-2 begin
export const ThemeSwitcher: FC<ThemeSwitcherProps> = ({
  theme,
  onToggle,
  preference,
  className,
}) => {
// @@T org-2 end
  if (preference === 'system') return null;
  const next: ThemeName = theme === 'dark'
    ? 'light'
    : 'dark';
  return (
    <IconButton
      className={className}
      icon={(
        <Icon
          name={theme === 'dark'
            ? 'sun'
            : 'moon'}
          size={18}
        />
      )}
      label={`Switch to ${next} theme`}
      onClick={() => onToggle?.(next)}
    />
  );
};

ThemeSwitcher.displayName = 'ThemeSwitcher';
