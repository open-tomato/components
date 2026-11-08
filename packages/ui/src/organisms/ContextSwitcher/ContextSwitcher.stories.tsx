import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState, type ReactNode } from 'react';

import { ContextSwitcher, type ContextOption } from './ContextSwitcher';

/**
 * A switcher between contexts: the active one as a max-width pill, and a
 * menu of the most recent ones with a "see all" row and a "new" row. The
 * menu text and the row cap come from the caller; each option may carry
 * a free meta line. Hidden entirely with fewer than two options.
 */
const meta: Meta<typeof ContextSwitcher> = {
  title: 'Organisms/ContextSwitcher',
  component: ContextSwitcher,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Sample options, most recent first. */
const CONTEXTS: ContextOption[] = [
  { id: 'og', name: 'open-garden', meta: '12 members', tone: 'accent' },
  { id: 'bo', name: 'bright-orchard', meta: '6 members', tone: 'primary' },
  { id: 'vp', name: 'vine-patch', meta: '3 members', tone: 'gold' },
];

/** Seven options, more than the default cap of five. */
const MANY: ContextOption[] = [
  ...CONTEXTS,
  { id: 'sb', name: 'seed-bank', meta: 'staging', tone: 'primary' },
  { id: 'cf', name: 'cold-frame', tone: 'gold' },
  { id: 'gh', name: 'greenhouse', meta: '3 projects' },
  { id: 'ap', name: 'apiary', tone: 'accent' },
];

/** Room for the open menu under the pill. */
const OpenFrame = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-[320px] w-[360px] items-start">{children}</div>
);

/** The resting pill: monogram, truncating name, chevron. */
export const Default: Story = {
  args: { contexts: CONTEXTS, activeId: 'og' },
};

/** Menu open with the default labels; the active row carries the check, rows show their meta line where given. */
export const Open: Story = {
  args: { contexts: CONTEXTS, activeId: 'og', defaultOpen: true },
  render: (args) => (
    <OpenFrame>
      <ContextSwitcher {...args} />
    </OpenFrame>
  ),
};

/** Seven options: only the first five are listed, and the "see all" row shows the total. */
export const ManyOptions: Story = {
  args: { contexts: MANY, activeId: 'bo', defaultOpen: true },
  render: (args) => (
    <OpenFrame>
      <ContextSwitcher {...args} />
    </OpenFrame>
  ),
};

/** The caller's words and cap: labels for sites, and two recent rows. */
export const CustomLabels: Story = {
  args: {
    contexts: MANY,
    activeId: 'og',
    defaultOpen: true,
    recentLabel: 'Recent sites',
    seeAllLabel: 'See all sites',
    newLabel: 'New site',
    limit: 2,
  },
  render: (args) => (
    <OpenFrame>
      <ContextSwitcher {...args} />
    </OpenFrame>
  ),
};

/** A long name truncates inside the pill's max width. */
export const LongName: Story = {
  args: {
    contexts: [
      { id: 'long', name: 'the-long-running-experimental-orchard-of-many-rows', tone: 'gold' },
      ...CONTEXTS,
    ],
    activeId: 'long',
  },
};

const SwitchingDemo = () => {
  const [activeId, setActiveId] = useState('og');
  return (
    <OpenFrame>
      <ContextSwitcher contexts={CONTEXTS} activeId={activeId} onSwitch={setActiveId} defaultOpen />
    </OpenFrame>
  );
};

/** Controlled: selecting a row moves the check and the pill (parent-owned state). */
export const Switching: Story = {
  args: { contexts: CONTEXTS, activeId: 'og' },
  render: () => <SwitchingDemo />,
};

/** One option alone is nothing to switch between: the component renders nothing. */
export const SingleOptionHidden: Story = {
  args: { contexts: [CONTEXTS[0]!], activeId: 'og' },
  render: (args) => (
    <div className="flex h-10 w-64 items-center justify-center rounded-md border border-dashed border-border-soft text-xs text-fg3">
      <ContextSwitcher {...args} />
      renders null with one option
    </div>
  ),
};
