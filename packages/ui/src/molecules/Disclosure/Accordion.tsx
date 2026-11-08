import * as RadixAccordion from '@radix-ui/react-accordion';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ForwardRefExoticComponent,
  type JSX,
  type RefAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../lib';
import { touchableVariants } from '../../particles/touchable';

import {
  accordionBody,
  accordionChevron,
  accordionContent,
  accordionHeading,
  accordionItem,
  accordionTitle,
  accordionTrigger,
  accordionTriggerGroup,
  disclosureFrame,
} from './Disclosure.variants';

/**
 * Accordion — disclosure as a vertical stack. `mode` picks the selection
 * rule: 'single' (one-of, opening one closes the rest) or 'multiple'
 * (many-of).
 */
export type AccordionProps = {
  mode?: 'single' | 'multiple';
  /** Initially-open item value(s). */
  defaultValue?: string | string[];
  className?: string;
  children: ReactNode;
};

export const Accordion: { (props: AccordionProps): JSX.Element; displayName: string } = ({
  mode = 'single',
  defaultValue,
  className,
  children,
}: AccordionProps) => (mode === 'single'
  ? (
    <RadixAccordion.Root
      type="single"
      collapsible
      defaultValue={typeof defaultValue === 'string'
        ? defaultValue
        : undefined}
      className={cn(disclosureFrame(), className)}
    >
      {children}
    </RadixAccordion.Root>
  )
  : (
    <RadixAccordion.Root
      type="multiple"
      defaultValue={Array.isArray(defaultValue)
        ? defaultValue
        : undefined}
      className={cn(disclosureFrame(), className)}
    >
      {children}
    </RadixAccordion.Root>
  ));

Accordion.displayName = 'Accordion';

export interface AccordionItemProps
  extends Omit<ComponentPropsWithoutRef<typeof RadixAccordion.Item>, 'title'> {
  title: ReactNode;
}

export const AccordionItem: ForwardRefExoticComponent<
  AccordionItemProps & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, title, children, ...props }, ref) => (
    <RadixAccordion.Item
      ref={ref}
      className={cn(accordionItem(), className)}
      {...props}
    >
      <RadixAccordion.Header asChild>
        <h3 className={accordionHeading()}>
          <RadixAccordion.Trigger
            className={cn(
              touchableVariants({ noBrightness: false, rounded: 'none' }),
              accordionTrigger(),
              accordionTriggerGroup(),
            )}
          >
            <span className={accordionTitle()}>
              {title}
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={accordionChevron()}
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </RadixAccordion.Trigger>
        </h3>
      </RadixAccordion.Header>
      <RadixAccordion.Content className={accordionContent()}>
        <p className={accordionBody()}>
          {children}
        </p>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  ),
);

AccordionItem.displayName = 'AccordionItem';
