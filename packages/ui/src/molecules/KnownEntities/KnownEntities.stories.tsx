import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { Avatar } from '../../atoms/Avatar';
import { Badge } from '../../atoms/Badge';
import { StatusIndicator } from '../../atoms/StatusIndicator';

import { Entity } from './Entity';
import { EntityKindsProvider } from './EntityKinds';
import { type EntityKinds } from './entityKindsContext';
import { ACTIVITY_STATUS_TONE, type ActivityStatus } from './KnownEntities.variants';
import { ModelFooter } from './ModelFooter';

/** A neutral demo map — the kit ships no kinds; an implementor supplies its own. */
const DEMO_KINDS: EntityKinds = {
  worker: { icon: 'bot', tone: 'primary' },
  specialist: { icon: 'bot', tone: 'gold' },
  tool: { icon: 'plug', tone: 'primary' },
  skill: { icon: 'wand-sparkles', tone: 'accent' },
  model: { icon: 'cpu', tone: 'primary' },
  branch: { icon: 'git-branch', tone: 'muted', title: 'main' },
  task: {},
};

const Status = ({ status }: { status: ActivityStatus }) => (
  <StatusIndicator
    tone={ACTIVITY_STATUS_TONE[status]}
    pulse={status === 'running'}
    label={status}
  />
);

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-center gap-3 text-sm text-fg2">
    <span className="w-36 shrink-0 font-mono text-[11px] text-fg3">
      {label}
    </span>
    <div className="w-64">{children}</div>
  </div>
);

const meta: Meta<typeof Entity> = {
  title: 'Molecules/KnownEntities',
  component: Entity,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <EntityKindsProvider kinds={DEMO_KINDS}>
        <Story />
      </EntityKindsProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const BASE_ARGS = { title: 'the-refactorer' } as const;

/**
 * Spec: the `cell` layout — a compact tile, the title over a subtitle; the
 * `title` layout is the larger variant. The tile accent comes from the
 * kind's tone (shared chart palette).
 */
export const Agent: Story = {
  args: BASE_ARGS,
  render: () => (
    <div className="flex flex-col gap-3">
      <Row label="cell">
        <Entity layout="cell" kind="worker" title="the-refactorer" subtitle="sonnet-4-5" />
      </Row>
      <Row label="cell, gold">
        <Entity layout="cell" kind="specialist" title="the-profiler" subtitle="opus-4-5" />
      </Row>
      <Row label="title">
        <Entity
          layout="title"
          leading={<Avatar name="the-refactorer" size="md" shape="rounded" status="none" />}
          title="the-refactorer"
          subtitle="runner · worker-7d2f"
        />
      </Row>
      <Row label="title, bare">
        <Entity
          layout="title"
          leading={<Avatar name="the-gardener" size="md" shape="rounded" status="none" />}
          title="the-gardener"
        />
      </Row>
    </div>
  ),
};

/**
 * Spec: the `inline` layout with a status mark in `leading` (running
 * pulses) and the `cell` layout with the status mark beside a title over
 * `{instance id} · {branch}` greyed below.
 */
export const Session: Story = {
  args: BASE_ARGS,
  render: () => (
    <div className="flex flex-col gap-3">
      <Row label="inline">
        <Entity layout="inline" leading={<Status status="running" />} title="auth-refactor" />
      </Row>
      <Row label="failed">
        <Entity layout="inline" leading={<Status status="failed" />} title="rate-limit-bug" />
      </Row>
      <Row label="cell">
        <Entity
          layout="cell"
          leading={<Status status="done" />}
          title="auth-refactor"
          subtitle="worker-7d2f · feat/jwt-login"
        />
      </Row>
      <Row label="no branch">
        <Entity
          layout="cell"
          leading={<Status status="waiting" />}
          title="perf-investigate"
          subtitle="worker-93af"
        />
      </Row>
    </div>
  ),
};

/**
 * Spec: an inline entity — accent icon + name; `ModelFooter` — small icon
 * + name inheriting the footer color, no accent of its own (shown here
 * inside a greyed footer-colored line).
 */
export const Model: Story = {
  args: BASE_ARGS,
  render: () => (
    <div className="flex flex-col gap-3">
      <Row label="inline, no icon">
        <Entity layout="inline" title="sonnet-4-5" />
      </Row>
      <Row label="inline, icon">
        <Entity layout="inline" kind="model" title="opus-4-5" />
      </Row>
      <Row label="model-footer">
        <span className="font-mono text-[11px] text-fg3">
          <ModelFooter name="haiku-4-5" />
        </span>
      </Row>
    </div>
  ),
};

/**
 * Spec: an inline entity with the branch glyph from its kind (the title
 * falls back to the kind's default text), and one with an avatar in
 * `leading`.
 */
export const Inline: Story = {
  args: BASE_ARGS,
  render: () => (
    <div className="flex flex-col gap-3">
      <Row label="branch">
        <Entity layout="inline" kind="branch" title="feat/jwt-login" />
      </Row>
      <Row label="default text">
        <Entity layout="inline" kind="branch" />
      </Row>
      <Row label="user">
        <Entity
          layout="inline"
          leading={<Avatar name="Sam Lin" size="sm" status="none" />}
          title="sam"
        />
      </Row>
    </div>
  ),
};

/** Spec: a `cell` entity — title over inline text tags. */
export const Task: Story = {
  args: BASE_ARGS,
  render: () => (
    <div className="flex flex-col gap-3">
      <Row label="cell">
        <Entity
          layout="cell"
          kind="task"
          title="Migrate dashboard to new sidebar layout"
          subtitle="ui · feat · OT-21 · 2 sub"
        />
      </Row>
      <Row label="no subtitle">
        <Entity layout="cell" kind="task" title="Cache run logs locally for replay" />
      </Row>
    </div>
  ),
};

/**
 * Spec: a `title` entity — icon tile; bold name over a subtitle and a
 * type badge in `trailing`.
 */
export const Tool: Story = {
  args: BASE_ARGS,
  render: () => (
    <div className="flex flex-col gap-3">
      <Row label="title">
        <Entity
          layout="title"
          kind="tool"
          title="Repo Search"
          subtitle="gh-search"
          trailing={<Badge tone="neutral" size="sm">MCP</Badge>}
        />
      </Row>
      <Row label="skill">
        <Entity
          layout="title"
          kind="skill"
          title="Component from design"
          subtitle="component-from-design"
          trailing={<Badge tone="info" size="sm">skill</Badge>}
        />
      </Row>
    </div>
  ),
};
