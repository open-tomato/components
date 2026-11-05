import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Wizard, type WizardStep } from './Wizard';

interface Answers { name: string }

const steps: WizardStep<Answers>[] = [
  {
    key: 'one',
    title: 'Name it',
    short: 'Name',
    blurb: 'Pick a name',
    validate: (a) => (a.name ? null : 'Name required'),
    render: ({ answers, set, error }) => (
      <div>
        <input aria-label="name" value={answers.name} onChange={(e) => set('name', e.target.value)} />
        {error && <span role="alert">{error}</span>}
      </div>
    ),
  },
  {
    key: 'two',
    title: 'Review',
    short: 'Review',
    optional: true,
    validate: () => null,
    render: () => <p>All good</p>,
  },
];

const setup = (step: number, name = 'x') => {
  const h = {
    onAnswer: mock((_k: string, _v: unknown) => {}),
    onBack: mock(() => {}),
    onNext: mock(() => {}),
    onClose: mock(() => {}),
    onFinish: mock(() => {}),
  };
  render(
    <Wizard
      open
      steps={steps}
      step={step}
      answers={{ name }}
      heading={<b>Brand</b>}
      {...h}
    />,
  );
  return h;
};

describe('Wizard', () => {
  it('renders the first step with heading, blurb and counter', () => {
    setup(0);
    expect(screen.getByRole('heading', { name: 'Name it' })).toBeTruthy();
    expect(screen.getByText('Pick a name')).toBeTruthy();
    expect(screen.getByText('Brand')).toBeTruthy();
    expect(screen.getByText(/1 \/ 2/)).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Back' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('continues when valid and reports answers', () => {
    const h = setup(0);
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'abc' } });
    expect(h.onAnswer).toHaveBeenCalledWith('name', 'abc');
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(h.onNext).toHaveBeenCalledTimes(1);
  });

  it('gates Continue with the validation error', () => {
    setup(0, '');
    expect(screen.getByRole('alert').textContent).toBe('Name required');
    expect((screen.getByRole('button', { name: 'Continue' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows finish on the last optional step and wires back/finish/close', () => {
    const h = setup(1);
    expect(screen.getByText(/2 \/ 2 · optional/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(h.onBack).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Create workspace' }));
    expect(h.onFinish).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(h.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing for an out-of-range step', () => {
    setup(5);
    expect(screen.queryByRole('heading')).toBeNull();
  });
});
