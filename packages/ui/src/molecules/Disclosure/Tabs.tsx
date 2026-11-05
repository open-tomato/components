import * as RadixTabs from '@radix-ui/react-tabs';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  // @@T mol-3 begin
  type ForwardRefExoticComponent,
  type RefAttributes,
  // @@T mol-3 end
  type ReactNode,
} from 'react';

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';

import { disclosureFrame, tabsList, tabsTrigger } from './Disclosure.variants';

/**
 * Tabs — the same disclosure machine in single mode that never lets the
 * set go empty: a strip of triggers and one panel.
 */
// @@T mol-3 begin
export const Tabs: ForwardRefExoticComponent<
  ComponentPropsWithoutRef<typeof RadixTabs.Root> & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixTabs.Root>
>(
// @@T mol-3 end
  ({ className, ...props }, ref) => (
    <RadixTabs.Root ref={ref} className={cn(disclosureFrame(), className)} {...props} />
  ),
);

Tabs.displayName = 'Tabs';

// @@T mol-3 begin
export const TabsList: ForwardRefExoticComponent<
  ComponentPropsWithoutRef<typeof RadixTabs.List> & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixTabs.List>
>(
// @@T mol-3 end
  ({ className, ...props }, ref) => (
    <RadixTabs.List ref={ref} className={cn(tabsList(), className)} {...props} />
  ),
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps
  extends ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  /** Optional leading icon (15px). */
  icon?: ReactNode;
}

// @@T mol-3 begin
export const TabsTrigger: ForwardRefExoticComponent<
  TabsTriggerProps & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, TabsTriggerProps>(
// @@T mol-3 end
  ({ className, icon, children, ...props }, ref) => (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(
        touchable({ inline: true, rounded: 'none', noBrightness: false }),
        tabsTrigger(),
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </RadixTabs.Trigger>
  ),
);

TabsTrigger.displayName = 'TabsTrigger';

// @@T mol-3 begin
export const TabsContent: ForwardRefExoticComponent<
  ComponentPropsWithoutRef<typeof RadixTabs.Content> & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(
// @@T mol-3 end
  ({ className, ...props }, ref) => (
    <RadixTabs.Content
      ref={ref}
      className={cn('min-h-24 px-[18px] pb-5 pt-[18px] outline-none', className)}
      {...props}
    />
  ),
);

TabsContent.displayName = 'TabsContent';
