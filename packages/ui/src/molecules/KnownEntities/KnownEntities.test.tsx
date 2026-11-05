import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import {
  AgentCell,
  AgentTitle,
  BranchInline,
  ModelCell,
  ModelFooter,
  SessionCell,
  SessionInline,
  TaskCell,
  ToolTitle,
  UserInline,
} from '.';

describe('KnownEntities', () => {
  it('AgentCell renders name and model', () => {
    render(<AgentCell name="Planner" model="sonnet-4-5" tone="accent" icon="cpu" />);
    expect(screen.getByText('Planner')).toBeTruthy();
    expect(screen.getByText('sonnet-4-5')).toBeTruthy();
  });

  it('AgentCell uses default tone and icon', () => {
    render(<AgentCell name="Bot" model="m" />);
    expect(screen.getByText('Bot')).toBeTruthy();
  });

  it('AgentTitle renders with and without subtitle', () => {
    const { rerender } = render(<AgentTitle name="Planner" subtitle="runner" />);
    expect(screen.getByText('runner')).toBeTruthy();
    rerender(<AgentTitle name="Planner" />);
    expect(screen.queryByText('runner')).toBeNull();
    expect(screen.getAllByText('Planner').length).toBeGreaterThan(0);
  });

  it('BranchInline renders the branch name', () => {
    render(<BranchInline name="feat/x" />);
    expect(screen.getByText('feat/x')).toBeTruthy();
  });

  it('ModelCell renders dot or icon, and ModelFooter its name', () => {
    const { container, rerender } = render(<ModelCell name="opus" />);
    expect(screen.getByText('opus')).toBeTruthy();
    expect(container.querySelector('[aria-hidden]')).not.toBeNull();
    rerender(<ModelCell name="opus" icon="cpu" tone="primary" />);
    expect(container.querySelector('.rounded-full')).toBeNull();
    rerender(<ModelFooter name="haiku" />);
    expect(screen.getByText('haiku')).toBeTruthy();
    rerender(<ModelFooter name="haiku" icon="bot" />);
    expect(screen.getByText('haiku')).toBeTruthy();
  });

  it('SessionInline renders every status', () => {
    for (const status of ['running', 'waiting', 'done', 'failed', 'idle'] as const) {
      const { unmount } = render(<SessionInline name={`s-${status}`} status={status} />);
      expect(screen.getByText(`s-${status}`)).toBeTruthy();
      unmount();
    }
  });

  it('SessionCell renders instance id with and without branch', () => {
    const { rerender } = render(
      <SessionCell name="Run" status="running" agentInstanceId="agent-1" branch="main" />,
    );
    expect(screen.getByText('agent-1')).toBeTruthy();
    expect(screen.getByText('main')).toBeTruthy();
    rerender(<SessionCell name="Run" status="done" agentInstanceId="agent-1" />);
    expect(screen.queryByText('main')).toBeNull();
  });

  it('TaskCell renders title and tags', () => {
    const { rerender } = render(<TaskCell title="Fix it" tags={['ui', 'feat']} />);
    expect(screen.getByText('Fix it')).toBeTruthy();
    expect(screen.getByText('ui')).toBeTruthy();
    expect(screen.getByText('feat')).toBeTruthy();
    rerender(<TaskCell title="Fix it" tags={[]} />);
    expect(screen.queryByText('ui')).toBeNull();
    rerender(<TaskCell title="Fix it" />);
    expect(screen.getByText('Fix it')).toBeTruthy();
  });

  it('ToolTitle renders name, type badge and slug', () => {
    render(<ToolTitle name="Search" type="MCP" slug="gh-search" badgeTone="info" icon="bot" tone="primary" />);
    expect(screen.getByText('Search')).toBeTruthy();
    expect(screen.getByText('MCP')).toBeTruthy();
    expect(screen.getByText('gh-search')).toBeTruthy();
  });

  it('ToolTitle works with defaults', () => {
    render(<ToolTitle name="T" type="API" slug="t" />);
    expect(screen.getByText('API')).toBeTruthy();
  });

  it('UserInline renders the handle', () => {
    const { rerender } = render(<UserInline handle="sam" />);
    expect(screen.getByText('sam')).toBeTruthy();
    rerender(<UserInline handle="sam" name="Sam Example" />);
    expect(screen.getByText('sam')).toBeTruthy();
  });
});
