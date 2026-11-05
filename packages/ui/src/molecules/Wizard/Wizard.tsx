// @@T mol-1 begin
import { useId, type ReactElement, type ReactNode } from 'react';
// @@T mol-1 end

import { Button } from '../../atoms/Button';
import { Overlay } from '../../atoms/Overlay';
import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';
import { Stepper } from '../Stepper';

import {
  wizardPanel,
  // @@V mol-1 begin
  wizardBlurb,
  wizardBody,
  wizardBrandRow,
  wizardClose,
  wizardCounter,
  wizardFooter,
  wizardHeader,
  wizardTitle,
  // @@V mol-1 end
} from './Wizard.variants';

export interface WizardStep<A> {
  key: string;
  /** Body heading. */
  title: string;
  /** Stepper rail label. */
  short: string;
  blurb?: string;
  optional?: boolean;
  /** null = valid; a message gates Continue and reaches render(). */
  validate: (answers: A) => string | null;
  render: (ctx: {
    answers: A;
    set: (key: string, value: unknown) => void;
    error: string | null;
  }) => ReactNode;
}

export interface WizardProps<A> {
  open: boolean;
  steps: readonly WizardStep<A>[];
  step: number;
  answers: A;
  /** Header brand row content (e.g. mark + "New workspace"). */
  heading?: ReactNode;
  onAnswer: (key: string, value: unknown) => void;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onFinish: () => void;
}

// @@T mol-1 begin
export const Wizard: { <A>(props: WizardProps<A>): ReactElement | null; displayName: string } = <A,>({
// @@T mol-1 end
  open,
  steps,
  step,
  answers,
  heading,
  onAnswer,
  onBack,
  onNext,
  onClose,
  onFinish,
}: WizardProps<A>) => {
  const titleId = useId();
  const current = steps[step];
  if (!current) return null;
  const error = current.validate(answers);
  const isLast = step === steps.length - 1;
  return (
    <Overlay
      open={open}
      onClose={onClose}
      position="center"
      dismiss="escape"
      backdrop="blur"
    >
      <div aria-labelledby={titleId} className={wizardPanel()}>
        {/* header: brand row + the read-only stepper rail */}
        <div
          // @@V mol-1 begin
          className={wizardHeader()}
          // @@V mol-1 end
        >
          <div
            // @@V mol-1 begin
            className={wizardBrandRow()}
            // @@V mol-1 end
          >
            {heading}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              // @@V mol-1 begin
              className={cn(
                touchable({ inline: true, rounded: 'md', noBrightness: false }),
                wizardClose(),
              )}
              // @@V mol-1 end
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Stepper
            items={steps.map((s) => ({ key: s.key, label: s.short }))}
            index={step}
          />
        </div>

        {/* body: the current step */}
        <div
          // @@V mol-1 begin
          className={wizardBody()}
          // @@V mol-1 end
        >
          <h3
            id={titleId}
            // @@V mol-1 begin
            className={wizardTitle()}
            // @@V mol-1 end
          >
            {current.title}
          </h3>
          {current.blurb != null && (
            <p
              // @@V mol-1 begin
              className={wizardBlurb()}
              // @@V mol-1 end
            >
              {current.blurb}
            </p>
          )}
          {current.render({ answers, set: onAnswer, error })}
        </div>

        {/* footer: controlled nav */}
        <div
          // @@V mol-1 begin
          className={wizardFooter()}
          // @@V mol-1 end
        >
          <Button variant="secondary" disabled={step === 0} onClick={onBack}>
            Back
          </Button>
          <span
            // @@V mol-1 begin
            className={wizardCounter()}
            // @@V mol-1 end
          >
            {step + 1} / {steps.length}
            {current.optional
              ? ' · optional'
              : ''}
          </span>
          <Button
            variant={isLast
              ? 'primary'
              : 'accent'}
            disabled={error != null}
            onClick={isLast
              ? onFinish
              : onNext}
          >
            {isLast
              ? 'Create workspace'
              : 'Continue'}
          </Button>
        </div>
      </div>
    </Overlay>
  );
};

Wizard.displayName = 'Wizard';
