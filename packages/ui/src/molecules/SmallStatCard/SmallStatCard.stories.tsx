import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  FormattedCurrency,
  Icon,
  Sparkline,
  StatusIndicator,
} from '../../atoms';
import { Progress } from '../Progress';

import { SmallStatCard } from './SmallStatCard';

/** Fixed 30-point series (original MetricTile hero-row rhythm). */
const SERIES_30D = [
  22, 26, 30, 12, 10, 28, 34, 38, 31, 14,
  11, 33, 39, 41, 36, 15, 13, 38, 44, 40,
  37, 16, 14, 42, 47, 45, 41, 18, 46, 52,
];

const meta: Meta<typeof SmallStatCard> = {
  title: 'Molecules/SmallStatCard',
  component: SmallStatCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The original MetricTile "units used" tile: goal suffix (`/ 4M`) and a
 * sparkline bottom line. Fidelity source: the original usage screen hero row, first
 * tile. Spec: value + `current / goal` suffix + graphical bottom line.
 */
export const Default: Story = {
  args: {
    title: 'units used',
    value: 1_070_000,
    goal: 4_000_000,
    locale: 'en-US',
    footer: <Sparkline data={SERIES_30D} label="units per day" />,
  },
};

/**
 * Spec: top-right trend flavour — ratio prop renders a TrendIndicator
 * with signed percentage (original MetricTile `delta`/`deltaDir`).
 */
export const WithTrend: Story = {
  args: {
    title: 'items',
    value: 247,
    trend: 0.12,
    locale: 'en-US',
    footer: <Sparkline data={SERIES_30D.map((v) => v % 7)} label="items per day" />,
  },
};

/**
 * Spec: top-right decoration flavour (icon / avatar / label) — a
 * "Live now" card pairs a pulsing StatusIndicator.
 */
export const WithDecoration: Story = {
  args: {
    title: 'live now',
    value: 3,
    unit: 'items',
    locale: 'en-US',
    decoration: <StatusIndicator tone="ok" pulse label="active" />,
  },
};

/**
 * Spec: unit suffix, small and greyed, right of the value (`avg /
 * item` original tile). Icon decoration per the page spec ("Units today").
 */
export const WithUnit: Story = {
  args: {
    title: 'avg / item',
    value: 36_200,
    unit: 'units',
    locale: 'en-US',
    decoration: <Icon name="cpu" size={14} className="text-fg3" />,
  },
};

/**
 * ReactNode value — currency formatting stays with the Formatted family
 * (the page spec "Cost today" card).
 */
export const CurrencyValue: Story = {
  args: {
    title: 'cost today',
    value: <FormattedCurrency value={12.86} currency="usd" locale="en-US" />,
    trend: 0.08,
    locale: 'en-US',
    decoration: <Icon name="dollar-sign" size={14} className="text-fg3" />,
  },
};

/** Spec: text or link bottom line (contextual info / drill-down). */
export const WithLinkFooter: Story = {
  args: {
    title: 'errors',
    value: 4,
    trend: -0.3,
    locale: 'en-US',
    footer: (
      <a href="#items" className="text-accent underline-offset-2 hover:underline">
        View all items
      </a>
    ),
  },
};

/** Progress bottom line — the graphical-indicator flavour. */
export const WithProgressFooter: Story = {
  args: {
    title: 'budget',
    value: 1_070_000,
    goal: 4_000_000,
    unit: 'units',
    locale: 'en-US',
    footer: <Progress value={27} aria-label="27% of budget" />,
  },
};

/** Compact tile (`size="sm"`) — embedded/sidebar scale, no reserved footer space. */
export const Compact: Story = {
  args: {
    title: 'tool calls',
    value: 4_734,
    unit: 'calls',
    size: 'sm',
    locale: 'en-US',
  },
};
