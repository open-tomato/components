// @@T org-2 begin
import { useState, type ReactElement, type ReactNode } from 'react';
// @@T org-2 end

import { Avatar } from '../../atoms/Avatar';
import { Badge } from '../../atoms/Badge';
import { Icon } from '../../atoms/Icon';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSep,
  MenuTrigger,
} from '../../atoms/Menu';
// Deep member import, not the ConfirmPopover barrel (built-storybook lazy-init chunking hazard).
import { ConfirmInline } from '../../molecules/ConfirmPopover/ConfirmPopover';

// @@V org-2 begin
import {
  profileMenuContent,
  profileMenuEmail,
  profileMenuHeader,
  profileMenuIdentity,
  profileMenuItems,
  profileMenuLogout,
  profileMenuName,
  profileMenuRole,
  profileMenuSep,
  profileMenuTrigger,
} from './ProfileMenu.variants';
// @@V org-2 end

export interface ProfileMenuUser {
  name: string;
  email: string;
  /** Role label rendered as an info badge ("owner", "member"). */
  role: string;
}

export interface ProfileMenuProps {
  user: ProfileMenuUser;
  onProfile?: () => void;
  onAccountSettings?: () => void;
  // @@S org-2 begin
  /**
   * Extra menu items (`MenuItem`s) rendered after Account settings and
   * before the separator that precedes Log out.
   */
  actions?: ReactNode;
  // @@S org-2 end
  /** Fires only after the inline confirm is accepted. */
  onLogout?: () => void;
  /**
   * The logout confirmation copy — must name the action (spec: never a
   * bare "are you sure?").
   */
  logoutMessage?: string;
  /** Render with the menu open (docs/stories). */
  defaultOpen?: boolean;
}

// @@S org-2 begin
/**
 * ProfileMenu (app-shell spec: Top Bar): a touchable Avatar opening a menu
 * headed by the user's identity (avatar, name, email, role badge) over
 * My Profile / Account Settings / any caller-supplied `actions` / Logout.
 * Logout swaps the item for ConfirmPopover's inline flavour in-place —
 * Cancel returns to the menu, confirm fires `onLogout` and closes.
 *
 * Fidelity note (recorded): a "Help & docs" item is omitted — the spec's
 * option list does not include it; pass it through `actions` if needed.
 */
// @@S org-2 end
// @@T org-2 begin
export const ProfileMenu: {
  (props: ProfileMenuProps): ReactElement;
  displayName?: string;
} = ({
  user,
  onProfile,
  onAccountSettings,
  // @@S org-2 begin
  actions,
  // @@S org-2 end
  onLogout,
  logoutMessage = 'Log out of Acme?',
  defaultOpen = false,
}: ProfileMenuProps): ReactElement => {
  // @@T org-2 end
  const [open, setOpen] = useState(defaultOpen);
  const [confirming, setConfirming] = useState(false);
  return (
    <Menu
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setConfirming(false);
      }}
      modal={false}
    >
      <MenuTrigger
        aria-label={`Account — ${user.name}`}
        // @@V org-2 begin
        className={profileMenuTrigger()}
        // @@V org-2 end
      >
        <Avatar name={user.name} size="md" status="none" />
      </MenuTrigger>
      <MenuContent
        align="end"
        // @@V org-2 begin
        className={profileMenuContent()}
        // @@V org-2 end
      >
        <div
          // @@V org-2 begin
          className={profileMenuHeader()}
          // @@V org-2 end
        >
          <Avatar name={user.name} size="lg" status="none" />
          <div
            // @@V org-2 begin
            className={profileMenuIdentity()}
            // @@V org-2 end
          >
            <div
              // @@V org-2 begin
              className={profileMenuName()}
              // @@V org-2 end
            >{user.name}</div>
            <div
              // @@V org-2 begin
              className={profileMenuEmail()}
              // @@V org-2 end
            >
              {user.email}
            </div>
            <div
              // @@V org-2 begin
              className={profileMenuRole()}
              // @@V org-2 end
            >
              <Badge tone="info" size="sm">{user.role}</Badge>
            </div>
          </div>
        </div>
        <div
          // @@V org-2 begin
          className={profileMenuItems()}
          // @@V org-2 end
        >
          <MenuItem
            icon={<Icon name="user" size={15} />}
            onSelect={() => onProfile?.()}
          >
            My profile
          </MenuItem>
          <MenuItem
            icon={<Icon name="settings" size={15} />}
            onSelect={() => onAccountSettings?.()}
          >
            Account settings
          </MenuItem>
          {/* @@S org-2 begin */}
          {actions}
          {/* @@S org-2 end */}
        </div>
        <MenuSep
          // @@V org-2 begin
          className={profileMenuSep()}
          // @@V org-2 end
        />
        <div
          // @@V org-2 begin
          className={profileMenuLogout()}
          // @@V org-2 end
        >
          {confirming
            ? (
              <ConfirmInline
                host="menu"
                danger
                message={logoutMessage}
                confirmLabel="Yes, log out"
                onConfirm={() => {
                  setOpen(false);
                  setConfirming(false);
                  onLogout?.();
                }}
                onCancel={() => setConfirming(false)}
              />
            )
            : (
              <MenuItem
                tone="danger"
                icon={<Icon name="log-out" size={15} />}
                onSelect={(e) => {
                  // Swap in the confirmation; the menu stays open.
                  e.preventDefault();
                  setConfirming(true);
                }}
              >
                Log out
              </MenuItem>
            )}
        </div>
      </MenuContent>
    </Menu>
  );
};

ProfileMenu.displayName = 'ProfileMenu';
