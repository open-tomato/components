import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';

import { Field } from '../../atoms/Field';

import { Wizard, type WizardProps, type WizardStep } from './Wizard';

interface Answers {
  name: string;
  model: string;
}

// @@S mol-1 begin
/** A compact setup step set. */
// @@S mol-1 end
const STEPS: WizardStep<Answers>[] = [
  {
    key: 'name',
    // @@S mol-1 begin
    title: 'Name your project',
    // @@S mol-1 end
    short: 'Name',
    // @@S mol-1 begin
    blurb: 'This is where your items and plans live. You can change it later.',
    // @@S mol-1 end
    validate: (a) => /^[a-z0-9][a-z0-9-]{2,}$/.test(a.name)
      ? null
      : 'Lowercase letters, numbers and dashes — at least 3 characters.',
    render: ({ answers, set, error }) => (
      <Field
        // @@S mol-1 begin
        label="Project name"
        // @@S mol-1 end
        state={error
          ? 'error'
          : 'default'}
        helper={error ?? 'Lowercase, no spaces. Used in your URL.'}
        value={answers.name}
        placeholder="open-garden"
        onChange={(e) => set('name', e.target.value)}
      />
    ),
  },
  {
    key: 'model',
    title: 'Pick a default model',
    short: 'Model',
    // @@S mol-1 begin
    blurb: 'Every new item starts here. Per-item overrides are always available.',
    // @@S mol-1 end
    validate: (a) => (a.model
      ? null
      : 'Choose a model to continue.'),
    render: ({ answers, set }) => (
      <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Default model">
        {['haiku-4', 'sonnet-4.5', 'opus-4'].map((m) => {
          const on = answers.model === m;
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => set('model', m)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-[15px] py-[13px] text-left ${
                on
                  ? 'border-primary bg-[color-mix(in_oklab,var(--primary)_9%,var(--surface-1))] shadow-sm'
                  : 'border-border-soft bg-surface-1'
              }`}
            >
              <span
                className={`inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                  on
                    ? 'border-primary'
                    : 'border-border-strong'
                }`}
              >
                {on && <span className="size-[9px] rounded-full bg-primary" />}
              </span>
              <span className="font-mono text-sm font-bold text-fg1">{m}</span>
            </button>
          );
        })}
      </div>
    ),
  },
  {
    key: 'review',
    title: 'Review & create',
    short: 'Review',
    // @@S mol-1 begin
    blurb: 'One last look. We\'ll create an empty project and take you to the overview.',
    // @@S mol-1 end
    validate: () => null,
    render: ({ answers }) => (
      <div className="flex flex-col overflow-hidden rounded-lg border border-border-soft">
        {[
          // @@S mol-1 begin
          ['Project', answers.name
            ? `example.dev/${answers.name}`
            : '—'],
          // @@S mol-1 end
          ['Default model', answers.model || '—'],
        ].map(([k, v], i) => (
          <div
            key={k}
            className={`flex justify-between gap-4 px-4 py-[13px] ${
              i % 2
                ? 'bg-surface-1'
                : 'bg-surface-sunk'
            } ${i === 0
              ? 'border-b border-border-soft'
              : ''}`}
          >
            <span className="text-[13px] text-fg3">{k}</span>
            <span className="break-words text-right font-mono text-[13.5px] font-semibold text-fg1">
              {v}
            </span>
          </div>
        ))}
      </div>
    ),
  },
];

const Heading = () => (
  <>
    {/* @@S mol-1 begin */}
    <span aria-hidden className="size-[22px] rounded-full bg-primary" />
    <span className="font-display text-sm font-bold text-fg1">New project</span>
    {/* @@S mol-1 end */}
  </>
);

// @@T mol-1 begin
const meta: Meta<typeof Wizard<Answers>> = {
// @@T mol-1 end
  title: 'Molecules/Wizard',
  component: Wizard,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    open: true,
    steps: STEPS,
    step: 0,
    answers: { name: '', model: 'sonnet-4.5' },
    heading: <Heading />,
    // @@S mol-1 begin
    submitLabel: 'Create',
    // @@S mol-1 end
    onAnswer: () => {},
    onBack: () => {},
    onNext: () => {},
    onClose: () => {},
    onFinish: () => {},
  },
  decorators: [
    (Story) => (
      <div className="h-dvh bg-bg p-10 font-mono text-xs text-fg3">
        page content behind the wizard
        <Story />
      </div>
    ),
  ],
// @@T mol-1 begin
};
// @@T mol-1 end

export default meta;
type Story = StoryObj<typeof meta>;

/** Step 1: empty name — Continue gated by validate(). */
export const Default: Story = {};

/** Model step: radio cards, valid → Continue enabled. */
export const ModelStep: Story = {
  args: { step: 1, answers: { name: 'open-garden', model: 'sonnet-4.5' } },
};

/** Last step: review rows + the primary Create action. */
export const ReviewStep: Story = {
  args: { step: 2, answers: { name: 'open-garden', model: 'sonnet-4.5' } },
};

/** Fully interactive: parent owns step + answers (the controlled contract). */
const PlaygroundDemo = (args: WizardProps<Answers>) => {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ name: '', model: 'sonnet-4.5' });
  return (
    <Wizard
      {...args}
      open={open}
      step={step}
      answers={answers}
      onAnswer={(k, v) => setAnswers((a) => ({ ...a, [k]: v as string }))}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
      onClose={() => setOpen(false)}
      onFinish={() => setOpen(false)}
    />
  );
};

export const Playground: Story = {
  render: (args) => <PlaygroundDemo {...args} />,
};
