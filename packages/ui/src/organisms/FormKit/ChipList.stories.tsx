import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { ChipList, type ChipOption } from './ChipList';
import { FormField } from './FormField';

/**
 * Chip input with typeahead suggestions (spec: the component spec
 * "ChipList"): typing opens the list with the first result preselected;
 * ↑↓/Enter or click select; chips render in-container with a remove X.
 * Multi mode excludes selected options from further results; single
 * mode lets the chip take over; `allowNew` creates chips from free
 * text.
 */
// @@T org-1 begin
const meta: Meta<typeof ChipList> = {
// @@T org-1 end
  title: 'Organisms/ChipList',
  component: ChipList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
// @@T org-1 begin
};
// @@T org-1 end

export default meta;
type Story = StoryObj<typeof meta>;

// @@S org-1 begin
/** Known system events for the "Call webhook on" field. */
// @@S org-1 end
const EVENTS: ChipOption[] = [
  // @@S org-1 begin
  { value: 'run.started', label: 'run.started' },
  { value: 'run.finished', label: 'run.finished' },
  { value: 'run.failed', label: 'run.failed' },
  { value: 'profile.created', label: 'profile.created' },
  // @@S org-1 end
  { value: 'task.moved', label: 'task.moved' },
  { value: 'budget.exceeded', label: 'budget.exceeded' },
];

// @@S org-1 begin
const MultiDemo = ({ initial = ['run.failed'] }: { initial?: string[] }) => {
// @@S org-1 end
  const [picked, setPicked] = useState(initial);
  return (
    <div className="w-[380px]">
      <FormField
        label="Call webhook on"
        hint="Which system events should fire this tool?"
      >
        <ChipList
          options={EVENTS}
          value={picked}
          onChange={setPicked}
          ariaLabel="System events"
          placeholder="Add an event…"
        />
      </FormField>
    </div>
  );
};

/**
 * Spec: multi mode — chips stack at the top of the container, the input
 * stays below, and selected options stop appearing in the results
 * (removing a chip brings its option back).
 */
export const Multi: Story = {
  args: { options: EVENTS, value: [], onChange: () => {} },
  render: () => <MultiDemo />,
};

/**
 * Keyboard path with real events: typing preselects the FIRST result,
 * bare Enter takes it; ↑↓ move the active row; selected options are
 * excluded from later searches.
 */
export const MultiKeyboard: Story = {
  args: { options: EVENTS, value: [], onChange: () => {} },
  render: () => <MultiDemo initial={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    // Typing opens the list, first result preselected; Enter takes it.
    // @@S org-1 begin
    await userEvent.type(input, 'run');
    // @@S org-1 end
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    const first = canvas.getAllByRole('option');
    // @@S org-1 begin
    await expect(first[0]).toHaveTextContent('run.started');
    // @@S org-1 end
    await expect(first[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Enter}');
    // @@S org-1 begin
    await expect(await canvas.findByText('run.started')).toBeVisible();
    // @@S org-1 end
    // The selected option is excluded from the next search; arrows move.
    // @@S org-1 begin
    await userEvent.type(input, 'run');
    // @@S org-1 end
    const next = canvas.getAllByRole('option');
    // @@S org-1 begin
    await expect(next.map((o) => o.textContent)).not.toContain('run.started');
    // @@S org-1 end
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(next[1]).toHaveAttribute('aria-selected', 'true'));
    await userEvent.keyboard('{Enter}');
    // @@S org-1 begin
    await expect(await canvas.findByText('run.failed')).toBeVisible();
    // @@S org-1 end
  },
};

const SingleDemo = () => {
  // @@S org-1 begin
  const [picked, setPicked] = useState(['profile.created']);
  // @@S org-1 end
  return (
    <div className="w-[380px]">
      <FormField label="Trigger event" hint="Single mode — remove the chip to search again.">
        <ChipList
          mode="single"
          options={EVENTS}
          value={picked}
          onChange={setPicked}
          ariaLabel="Trigger event"
        />
      </FormField>
    </div>
  );
};

/**
 * Spec: single mode — the chip takes over the container (input hidden)
 * until its X removes it.
 */
export const Single: Story = {
  args: { mode: 'single', options: EVENTS, value: [], onChange: () => {} },
  render: () => <SingleDemo />,
};

const AllowNewDemo = () => {
  const [tags, setTags] = useState(['infra']);
  return (
    <div className="w-[380px]">
      <FormField label="Tags" hint="Pick existing tags or define new ones on the fly.">
        <ChipList
          options={[
            { value: 'infra', label: 'infra' },
            { value: 'frontend', label: 'frontend' },
            { value: 'billing', label: 'billing' },
          ]}
          value={tags}
          onChange={setTags}
          allowNew
          ariaLabel="Tags"
          placeholder="Add a tag…"
        />
      </FormField>
    </div>
  );
};

/**
 * Spec: `allowNew` — unmatched typed text leads the list as a Create
 * option and becomes a chip when selected.
 */
export const AllowNew: Story = {
  args: { options: [], value: [], onChange: () => {}, allowNew: true },
  render: () => <AllowNewDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    await userEvent.type(input, 'observability');
    const options = await canvas.findAllByRole('option');
    await expect(options[0]).toHaveTextContent('Create');
    await userEvent.keyboard('{Enter}');
    await expect(await canvas.findByText('observability')).toBeVisible();
  },
};
