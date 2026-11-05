import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';

import {
  ACTIVITY_STATUS_TONE,
  Entity,
  EntityKindsProvider,
  ModelFooter,
  useEntityKinds,
  type EntityKinds,
} from '.';

afterEach(cleanup);

const KINDS: EntityKinds = {
  worker: { icon: 'bot', tone: 'primary', title: 'Default worker', subtitle: 'idle' },
  plain: {},
};

describe('Entity', () => {
  it('renders every layout with its title and subtitle', () => {
    for (const layout of ['inline', 'cell', 'title'] as const) {
      const { unmount } = render(<Entity layout={layout} title={`t-${layout}`} subtitle="sub" />);
      expect(screen.getByText(`t-${layout}`)).toBeTruthy();
      if (layout !== 'inline') expect(screen.getByText('sub')).toBeTruthy();
      unmount();
    }
  });

  it('defaults to the inline layout, rendered as a span', () => {
    const { container } = render(<Entity title="x" />);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });

  it('renders the cell and title layouts as a div', () => {
    const { container } = render(<Entity layout="cell" title="x" />);
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  it('renders the leading, subtitle and trailing slots', () => {
    render(
      <Entity
        layout="title"
        leading={<i data-testid="lead" />}
        title="Name"
        subtitle="slug"
        trailing={<b>badge</b>}
      />,
    );
    expect(screen.getByTestId('lead')).toBeTruthy();
    expect(screen.getByText('slug')).toBeTruthy();
    expect(screen.getByText('badge')).toBeTruthy();
  });

  it('shows the trailing slot of an inline entity', () => {
    render(<Entity title="Name" trailing={<b>badge</b>} />);
    expect(screen.getByText('badge')).toBeTruthy();
  });

  it('takes icon and default texts from the kind map', () => {
    const { container } = render(
      <EntityKindsProvider kinds={KINDS}>
        <Entity layout="cell" kind="worker" />
      </EntityKindsProvider>,
    );
    expect(screen.getByText('Default worker')).toBeTruthy();
    expect(screen.getByText('idle')).toBeTruthy();
    expect(container.querySelector('.text-primary')).not.toBeNull();
  });

  it('lets explicit texts and leading beat the kind defaults', () => {
    const { container } = render(
      <EntityKindsProvider kinds={KINDS}>
        <Entity layout="inline" kind="worker" title="Mine" leading={<i data-testid="own" />} />
      </EntityKindsProvider>,
    );
    expect(screen.getByText('Mine')).toBeTruthy();
    expect(screen.queryByText('Default worker')).toBeNull();
    expect(screen.getByTestId('own')).toBeTruthy();
    expect(container.querySelector('.text-primary')).toBeNull();
  });

  it('renders a kind without an icon with no glyph', () => {
    const { container } = render(
      <EntityKindsProvider kinds={KINDS}>
        <Entity kind="plain" title="Plain" />
      </EntityKindsProvider>,
    );
    expect(container.querySelector('.text-primary')).toBeNull();
  });

  it('renders an unknown kind from its own texts without a provider', () => {
    render(<Entity kind="missing" title="Still shown" />);
    expect(screen.getByText('Still shown')).toBeTruthy();
  });
});

describe('useEntityKinds', () => {
  it('is empty without a provider and the supplied map within one', () => {
    const Probe = () => <span>{Object.keys(useEntityKinds()).join(',')}</span>;
    const { container, rerender } = render(<Probe />);
    expect(container.textContent).toBe('');
    rerender(
      <EntityKindsProvider kinds={KINDS}>
        <Probe />
      </EntityKindsProvider>,
    );
    expect(container.textContent).toBe('worker,plain');
  });
});

describe('ACTIVITY_STATUS_TONE', () => {
  it('maps the five statuses to indicator tones', () => {
    expect(ACTIVITY_STATUS_TONE).toEqual({
      running: 'ok',
      waiting: 'warn',
      done: 'info',
      failed: 'err',
      idle: 'disabled',
    });
  });
});

describe('ModelFooter', () => {
  it('renders its name with the default and a custom icon', () => {
    const { rerender } = render(<ModelFooter name="haiku" />);
    expect(screen.getByText('haiku')).toBeTruthy();
    rerender(<ModelFooter name="haiku" icon="bot" />);
    expect(screen.getByText('haiku')).toBeTruthy();
  });
});
