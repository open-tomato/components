import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

import { cn } from '../../lib';

import {
  menu,
  menuItem,
  menuItemLabel,
  menuLabel,
  menuSep,
  type MenuItemVariants,
  type MenuVariants,
} from './Menu.variants';

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
export const Menu:
import('react').FC<DropdownMenu.DropdownMenuProps> = DropdownMenu.Root;
export const MenuTrigger:
import('react').ForwardRefExoticComponent<DropdownMenu.DropdownMenuTriggerProps & import('react').RefAttributes<HTMLButtonElement>> = DropdownMenu.Trigger;

export interface MenuContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof DropdownMenu.Content>,
    'align'
  >,
  MenuVariants {}

export const MenuContent:
import('react').ForwardRefExoticComponent<MenuContentProps & import('react').RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, MenuContentProps>(
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

export const MenuItem:
import('react').ForwardRefExoticComponent<MenuItemProps & import('react').RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, tone, icon, trailing, children, ...props }, ref) => (
    <DropdownMenu.Item
      ref={ref}
      className={cn(menuItem({ tone }), className)}
      {...props}
    >
      {icon}
      <span className={menuItemLabel()}>{children}</span>
      {trailing}
    </DropdownMenu.Item>
  ),
);

MenuItem.displayName = 'MenuItem';

export const MenuLabel:
import('react').ForwardRefExoticComponent<Omit<DropdownMenu.DropdownMenuLabelProps & import('react').RefAttributes<HTMLDivElement>, 'ref'> & import('react').RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenu.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenu.Label
    ref={ref}
    className={cn(menuLabel(), className)}
    {...props}
  />
));

MenuLabel.displayName = 'MenuLabel';

export const MenuSep:
import('react').ForwardRefExoticComponent<Omit<DropdownMenu.DropdownMenuSeparatorProps & import('react').RefAttributes<HTMLDivElement>, 'ref'> & import('react').RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenu.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenu.Separator
    ref={ref}
    className={cn(menuSep(), className)}
    {...props}
  />
));

MenuSep.displayName = 'MenuSep';
