import type { Meta, StoryObj } from '@storybook/react-vite';

import { LiveShell } from '../../stories/shell-fixtures';

import { AppShell } from './AppShell';

/**
 * The template's own variants: expanded and collapsed rail. The sidebar's
 * sections are NOT variants of the shell — each is a page (see Pages/*);
 * the shell remains while the content slot swaps.
 *
 * Since WS03d the harness chrome is the real components: the collapse
 * button lives on AppShellTopbar itself (app-shell spec), the nav
 * is the data-driven SidebarNav, the rail carries SidebarQuota +
 * SidebarQuickAccess, and the topbar composes the group switcher /
 * SearchSuggest / NotificationsBell / ThemeSwitcher / ProfileMenu.
 *
 * Height: these stories frame the shell in a fixed 560px box, because the
 * shell fills the box its parent gives it. An app gives it that box by
 * sizing its root (`html, body, #root { height: 100%; }`) or by passing
 * `viewport`, which the Viewport story shows.
 */
const meta: Meta<typeof AppShell> = {
  title: 'Templates/AppShell',
  component: AppShell,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Expanded rail (264px) — the original demo's default, overview content. */
export const Default: Story = {
  render: () => <LiveShell />,
};

/** Collapsed rail — 64px, icons only, budget card hidden. */
export const Collapsed: Story = {
  render: () => <LiveShell collapsed />,
};

/**
 * The optional AppShellContent footer slot (app-shell spec: Main
 * Content) — copyright + general links at the end of the scroll flow.
 */
export const WithContentFooter: Story = {
  render: () => <LiveShell page="settings" withFooter />,
};

/**
 * `viewport`: the shell fills the viewport whatever its parent, as an app
 * mounting it at the page root needs. The rail runs the full height.
 */
export const Viewport: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <LiveShell viewport />,
};
