import type { SelectionItem } from '../Breadcrumb';

// @@T mol-1 begin
import { forwardRef, Fragment, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';

import {
  stepperConnector,
  stepperDot,
  stepperLabel,
  // @@V mol-1 begin
  stepperButton,
  stepperRoot,
  stepperStatic,
  // @@V mol-1 end
} from './Stepper.variants';

export interface StepperProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: readonly SelectionItem[];
  index: number;
  /** Omit to render a read-only rail (e.g. inside the Wizard header). */
  onChange?: (index: number) => void;
  /** accent = the auth flows' FlowStepper coloring. */
  tone?: 'primary' | 'accent';
  /** sm = 22px dots, 12px labels (auth flows). */
  size?: 'md' | 'sm';
}

const Check = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// @@T mol-1 begin
export const Stepper: ForwardRefExoticComponent<PropsWithoutRef<StepperProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, StepperProps>(
// @@T mol-1 end
  (
    { className, items, index, onChange, tone = 'primary', size = 'md', ...props },
    ref,
  ) => (
    <div
      ref={ref}
      // @@V mol-1 begin
      className={cn(stepperRoot({ size }), className)}
      // @@V mol-1 end
      {...props}
    >
      {items.map((item, i) => {
        const state = i < index
          ? 'done'
          : i === index
            ? 'active'
            : 'upcoming';
        const content = (
          <>
            <span className={stepperDot({ state, tone, size })}>
              {state === 'done'
                ? (
                  <Check size={size === 'sm'
                    ? 11
                    : 14} />
                )
                : (
                  i + 1
                )}
            </span>
            <span className={stepperLabel({ state, tone, size })}>
              {item.label}
            </span>
          </>
        );
        return (
          <Fragment key={item.key}>
            {onChange
              ? (
                <button
                  type="button"
                  onClick={() => onChange(i)}
                  // @@V mol-1 begin
                  className={cn(
                    touchable({ inline: true, noBrightness: false }),
                    stepperButton(),
                  )}
                  // @@V mol-1 end
                >
                  {content}
                </button>
              )
              : (
                <span
                  // @@V mol-1 begin
                  className={stepperStatic()}
                  // @@V mol-1 end
                >
                  {content}
                </span>
              )}
            {i < items.length - 1 && (
              <span className={stepperConnector({ done: i < index, tone, size })} />
            )}
          </Fragment>
        );
      })}
    </div>
  ),
);

Stepper.displayName = 'Stepper';
