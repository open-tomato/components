import { useId, type ReactElement, type ReactNode } from 'react';

import { Button } from '../../atoms/Button';
import { Overlay } from '../../atoms/Overlay';
import { cn } from '../../lib';
import { touchableVariants } from '../../particles/touchable';
import { Stepper } from '../Stepper';

import {
  wizardPanel,
  wizardBlurb,
  wizardBody,
  wizardBrandRow,
  wizardClose,
  wizardCounter,
  wizardFooter,
  wizardHeader,
  wizardTitle,
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
  /** Header brand row content (e.g. a mark + a title). */
  heading?: ReactNode;
  /** Label of the primary action on the last step. */
  submitLabel?: ReactNode;
  onAnswer: (key: string, value: unknown) => void;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onFinish: () => void;
}

export const Wizard: { <A>(props: WizardProps<A>): ReactElement | null; displayName: string } = <A,>({
  open,
  steps,
  step,
  answers,
  heading,
  submitLabel = 'Finish',
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
          className={wizardHeader()}
        >
          <div
            className={wizardBrandRow()}
          >
            {heading}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className={cn(
                touchableVariants({ inline: true, rounded: 'md', noBrightness: false }),
                wizardClose(),
              )}
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
          className={wizardBody()}
        >
          <h3
            id={titleId}
            className={wizardTitle()}
          >
            {current.title}
          </h3>
          {current.blurb != null && (
            <p
              className={wizardBlurb()}
            >
              {current.blurb}
            </p>
          )}
          {current.render({ answers, set: onAnswer, error })}
        </div>

        {/* footer: controlled nav */}
        <div
          className={wizardFooter()}
        >
          <Button variant="secondary" disabled={step === 0} onClick={onBack}>
            Back
          </Button>
          <span
            className={wizardCounter()}
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
              ? submitLabel
              : 'Continue'}
          </Button>
        </div>
      </div>
    </Overlay>
  );
};

Wizard.displayName = 'Wizard';
