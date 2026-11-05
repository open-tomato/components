import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../atoms';

import { RowStatCard } from './RowStatCard';
import { RowStatCardMeter } from './RowStatCardMeter';

// @@T mol-1 begin
const meta: Meta<typeof RowStatCard> = {
// @@T mol-1 end
  title: 'Molecules/RowStatCard',
  component: RowStatCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
// @@T mol-1 begin
};
// @@T mol-1 end

export default meta;
type Story = StoryObj<typeof meta>;

// @@S mol-1 begin
/**
 * The "Monthly budget" card: title/subtitle left, used/forecast ministats
 * + action right, budget meter with forecast tick below. Spec-driven
 * choices: the forecast legend is CENTERED UNDER ITS TICK (centering it in
 * the caption row is misaligned), and the track uses surface-sunk instead
 * of a literal light colour so dark mode stays coherent.
 */
// @@S mol-1 end
export const Default: Story = {
  args: {
    title: 'Monthly budget',
    // @@S mol-1 begin
    subtitle: '1.07M of 4M units used · $13.35 spent so far',
    // @@S mol-1 end
    stats: [
      { title: 'used', value: '27%' },
      { title: 'forecast', value: '3.9M', tone: 'muted' },
    ],
    action: (
      <Button variant="secondary" size="sm">
        Adjust
      </Button>
    ),
    footer: (
      <RowStatCardMeter
        value={0.27}
        marker={{ ratio: 0.45, label: 'forecast end-of-month' }}
        startLabel="May 1"
        endLabel="May 31"
        label="27% of monthly budget used"
      />
    ),
  },
};

/**
 * Spec: automatic accent for trending ministats — `trend` colors the
 * value (up → success, down → danger); explicit `tone` overrides.
 */
export const AutoAccentedStats: Story = {
  args: {
    title: 'This week',
    // @@S mol-1 begin
    subtitle: '128 items across 9 groups',
    // @@S mol-1 end
    stats: [
      { title: 'done', value: 117, trend: 0.06 },
      { title: 'failed', value: 11, trend: -0.4 },
      { title: 'queued', value: 4 },
    ],
  },
};

/** Row 2 as contextual text/link instead of an indicator. */
export const TextFooter: Story = {
  args: {
    // @@S mol-1 begin
    title: 'Usage quota',
    subtitle: 'Account-wide, resets on the 1st',
    // @@S mol-1 end
    stats: [
      { title: 'remaining', value: '2.93M' },
      { title: 'burn rate', value: '96k/day', tone: 'warning' },
    ],
    footer: (
      <div className="text-xs text-fg3">
        Forecast exceeds quota around May 26 ·{' '}
        <a href="#usage" className="text-accent underline-offset-2 hover:underline">
          View usage
        </a>
      </div>
    ),
  },
};

/** Meter near the warning threshold (tone axis: accent → warning → danger). */
export const MeterWarning: Story = {
  args: {
    title: 'Monthly budget',
    // @@S mol-1 begin
    subtitle: '3.4M of 4M units used · $41.20 spent so far',
    // @@S mol-1 end
    stats: [
      { title: 'used', value: '85%', tone: 'warning' },
      { title: 'forecast', value: '4.6M', tone: 'muted' },
    ],
    footer: (
      <RowStatCardMeter
        value={0.85}
        tone="warning"
        marker={{ ratio: 0.97, label: 'forecast end-of-month' }}
        startLabel="May 1"
        endLabel="May 31"
        label="85% of monthly budget used"
      />
    ),
  },
};

/** Row 1 only — no footer, no action. */
export const StatsOnly: Story = {
  args: {
    // @@S mol-1 begin
    title: 'Groups',
    subtitle: '9 configured',
    // @@S mol-1 end
    stats: [
      { title: 'active', value: 6 },
      { title: 'errors', value: 1, tone: 'danger' },
      { title: 'idle', value: 2, tone: 'muted' },
    ],
  },
};
