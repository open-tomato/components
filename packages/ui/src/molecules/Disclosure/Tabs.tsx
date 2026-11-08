import * as RadixTabs from '@radix-ui/react-tabs';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../lib';
import { touchableVariants } from '../../particles/touchable';

import {
  disclosureFrame,
  tabsContent,
  tabsList,
  tabsTrigger,
} from './Disclosure.variants';

/**
 * Tabs — the same disclosure machine in single mode that never lets the
 * set go empty: a strip of triggers and one panel.
 */
export const Tabs: ForwardRefExoticComponent<
  ComponentPropsWithoutRef<typeof RadixTabs.Root> & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixTabs.Root>
>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Root ref={ref} className={cn(disclosureFrame(), className)} {...props} />
  ),
);

Tabs.displayName = 'Tabs';

export const TabsList: ForwardRefExoticComponent<
  ComponentPropsWithoutRef<typeof RadixTabs.List> & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixTabs.List>
>(
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

export const TabsTrigger: ForwardRefExoticComponent<
  TabsTriggerProps & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, icon, children, ...props }, ref) => (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(
        touchableVariants({ inline: true, rounded: 'none', noBrightness: false }),
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

export const TabsContent: ForwardRefExoticComponent<
  ComponentPropsWithoutRef<typeof RadixTabs.Content> & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Content
      ref={ref}
      className={cn(tabsContent(), className)}
      {...props}
    />
  ),
);

TabsContent.displayName = 'TabsContent';
