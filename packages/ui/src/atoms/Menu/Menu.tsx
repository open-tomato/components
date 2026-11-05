import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

import { cn } from '../../lib';

// @@V ato-2 begin
import {
  menu,
  menuItem,
  menuItemLabel,
  menuLabel,
  menuSep,
  type MenuItemVariants,
  type MenuVariants,
} from './Menu.variants';
// @@V ato-2 end

// @@S ato-2 begin
/**
 * Compound API:
 *
 *   <Menu>
 *     <MenuTrigger asChild><Button>Actions</Button></MenuTrigger>
 *     <MenuContent size="md" align="start">
 *       <MenuLabel>Group</MenuLabel>
 *       <MenuItem icon={<Eye />} onSelect={open}>Open item</MenuItem>
 *       <MenuSep />
 *       <MenuItem tone="danger">Delete item</MenuItem>
 *     </MenuContent>
 *   </Menu>
 *
 * Radix owns anchoring/flip, outside-click + Escape dismissal, and roving
 * arrow-key focus.
 */
// @@S ato-2 end
// eslint-disable-next-line react-refresh/only-export-components -- Radix re-export, still a component
// @@T ato-2 begin
export const Menu:
import('react').FC<DropdownMenu.DropdownMenuProps> = DropdownMenu.Root;
// @@T ato-2 end
// eslint-disable-next-line react-refresh/only-export-components -- Radix re-export, still a component
// @@T ato-2 begin
export const MenuTrigger:
import('react').ForwardRefExoticComponent<DropdownMenu.DropdownMenuTriggerProps & import('react').RefAttributes<HTMLButtonElement>> = DropdownMenu.Trigger;
// @@T ato-2 end

export interface MenuContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof DropdownMenu.Content>,
    'align'
  >,
  MenuVariants {}

// @@T ato-2 begin
export const MenuContent:
import('react').ForwardRefExoticComponent<MenuContentProps & import('react').RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, MenuContentProps>(
// @@T ato-2 end
  ({ className, align, size, sideOffset = 6, ...props }, ref) => (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        ref={ref}
        align={align === 'end'
          ? 'end'
          : 'start'}
        sideOffset={sideOffset}
        className={cn(menu({ align, size }), className)}
        {...props}
      />
    </DropdownMenu.Portal>
  ),
);

MenuContent.displayName = 'MenuContent';

export interface MenuItemProps
  extends ComponentPropsWithoutRef<typeof DropdownMenu.Item>,
  MenuItemVariants {
  /** Optional leading icon (16px). */
  icon?: ReactNode;
  /** Optional trailing slot (shortcut hint, checkmark, …). */
  trailing?: ReactNode;
}

// @@T ato-2 begin
export const MenuItem:
import('react').ForwardRefExoticComponent<MenuItemProps & import('react').RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, MenuItemProps>(
// @@T ato-2 end
  ({ className, tone, icon, trailing, children, ...props }, ref) => (
    <DropdownMenu.Item
      ref={ref}
      className={cn(menuItem({ tone }), className)}
      {...props}
    >
      {icon}
      {/* @@V ato-2 begin */}
      <span className={menuItemLabel()}>{children}</span>
      {/* @@V ato-2 end */}
      {trailing}
    </DropdownMenu.Item>
  ),
);

MenuItem.displayName = 'MenuItem';

// @@T ato-2 begin
export const MenuLabel:
import('react').ForwardRefExoticComponent<Omit<DropdownMenu.DropdownMenuLabelProps & import('react').RefAttributes<HTMLDivElement>, 'ref'> & import('react').RefAttributes<HTMLDivElement>> = forwardRef<
// @@T ato-2 end
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenu.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenu.Label
    ref={ref}
    // @@V ato-2 begin
    className={cn(menuLabel(), className)}
    // @@V ato-2 end
    {...props}
  />
));

MenuLabel.displayName = 'MenuLabel';

// @@T ato-2 begin
export const MenuSep:
import('react').ForwardRefExoticComponent<Omit<DropdownMenu.DropdownMenuSeparatorProps & import('react').RefAttributes<HTMLDivElement>, 'ref'> & import('react').RefAttributes<HTMLDivElement>> = forwardRef<
// @@T ato-2 end
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenu.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenu.Separator
    ref={ref}
    // @@V ato-2 begin
    className={cn(menuSep(), className)}
    // @@V ato-2 end
    {...props}
  />
));

MenuSep.displayName = 'MenuSep';
