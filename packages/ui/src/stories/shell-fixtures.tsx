import type { JSX } from 'react';

import { useState } from 'react';

import { TomatoMark } from '../internal/TomatoMark';
import { cn } from '../lib';
import { EntityKindsProvider } from '../molecules/KnownEntities/EntityKinds';
import { type EntityKinds } from '../molecules/KnownEntities/entityKindsContext';
import {
  NotificationsBell,
  type NotificationItem,
} from '../organisms/NotificationsBell';
import { ProfileMenu } from '../organisms/ProfileMenu';
import {
  SearchSuggest,
  type SearchSuggestion,
} from '../organisms/SearchSuggest';
import { ThemeSwitcher, type ThemeName } from '../organisms/ThemeSwitcher';
import {
  AppShell,
  AppShellContent,
  AppShellMain,
  AppShellSidebar,
  AppShellTopbar,
  SidebarNav,
  SidebarQuickAccess,
  SidebarQuota,
  type SidebarNavConfigItem,
} from '../templates/AppShell';

import {
  liveShellFrame,
  placeholderPage,
  placeholderPageCard,
  placeholderPageGrid,
  placeholderPageHeading,
  placeholderPagePanel,
  shellDemoSpacer,
  sidebarDemoBrand,
  sidebarDemoWordmark,
  sidebarDemoWordmarkOpen,
  sidebarDemoWordmarkTomato,
  topbarDemoSearch,
  topbarDemoTitle,
} from './shell-fixtures.variants';
import {
  WorkspaceSwitcher,
  type WorkspaceOption,
} from './WorkspaceSwitcher';

/**
 * Story harness for the AppShell stories. The chrome is the REAL library
 * components — the group switcher, SearchSuggest, NotificationsBell,
 * ThemeSwitcher, ProfileMenu in the topbar; SidebarNav +
 * SidebarQuota + SidebarQuickAccess in the rail — this file only
 * supplies demo data, placeholder page content and the LiveShell wiring.
 * The shell remains; the page content changes.
 */

/* ---- demo data ----------------------------------------------------------- */

/** Nav as data (the app-shell spec icons). */
// eslint-disable-next-line react-refresh/only-export-components -- story fixture module mixing demo components and nav data; fast refresh does not apply
export const NAV_PRIMARY: SidebarNavConfigItem[] = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
  { id: 'items', label: 'Items', icon: 'terminal' },
  { id: 'teams', label: 'Teams', icon: 'bot' },
  { id: 'roadmap', label: 'Roadmap', icon: 'list' },
  { id: 'tools', label: 'Tools', icon: 'cpu' },
  { id: 'usage', label: 'Usage', icon: 'zap' },
];

const GROUPS: WorkspaceOption[] = [
  { id: 'og', name: 'open-garden', members: 12, tone: 'accent' },
  { id: 'rt', name: 'bright-orchard', members: 6, tone: 'primary' },
  { id: 'vp', name: 'vine-patch', members: 3, tone: 'gold' },
];

/** A neutral demo map for the suggestion kinds — the kit ships none. */
const SUGGESTION_KINDS: EntityKinds = {
  worker: { icon: 'bot', tone: 'primary' },
  run: { icon: 'terminal', tone: 'accent' },
  task: { icon: 'list', tone: 'gold' },
  connector: { icon: 'cpu', tone: 'info' },
  doc: { icon: 'book', tone: 'success' },
};

const SUGGESTIONS: SearchSuggestion[] = [
  { kind: 'worker', label: 'auth-refactor', sub: 'running · worker-7d2f' },
  { kind: 'run', label: 'settings page draft', sub: '12m ago · sam' },
  { kind: 'task', label: 'Add per-connector usage chart to usage page', sub: 'roadmap · high' },
  { kind: 'connector', label: 'github-issues', sub: 'MCP · connected' },
  { kind: 'doc', label: 'Composting context between runs', sub: 'docs/experiments' },
];

const NOTIFICATIONS: NotificationItem[] = [
  { id: 1, unread: true, level: 'ok', title: 'auth-refactor finished', body: '8 files updated · 12.3k units', time: '2m ago' },
  { id: 2, unread: true, level: 'warn', title: 'perf-investigate is waiting', body: 'Token budget paused at 0/200k.', time: '14m ago' },
  { id: 3, unread: false, level: 'info', icon: 'git-branch', title: 'docs-typos opened PR #214', body: '23 typos across docs/.', time: 'yesterday' },
];

const USER = { name: 'Jess Lin', email: 'jess@example.com', role: 'owner' };

/* ---- sidebar ------------------------------------------------------------- */

export const SidebarDemo = ({
  active,
  onNavigate,
  collapsed = false,
}: {
  active: string;
  onNavigate: (id: string) => void;
  collapsed?: boolean;
}): JSX.Element => (
  <>
    <div
      className={cn(sidebarDemoBrand({ collapsed }))}
    >
      <TomatoMark size={26} />
      {!collapsed && (
        <span className={sidebarDemoWordmark()}>
          <span className={sidebarDemoWordmarkOpen()}>acme</span>{' '}
          <span className={sidebarDemoWordmarkTomato()}>labs</span>
        </span>
      )}
    </div>
    <SidebarNav
      items={NAV_PRIMARY}
      activeId={active}
      onNavigate={onNavigate}
      collapsed={collapsed}
    />
    <div className={shellDemoSpacer()} />
    <SidebarQuota
      title="this week"
      unit="units"
      status="healthy"
      used={1_200_000}
      limit={4_000_000}
      collapsed={collapsed}
    />
    <SidebarQuickAccess
      collapsed={collapsed}
      items={[
        { id: 'docs', label: 'Docs', icon: 'book', href: 'https://example.com/docs' },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'settings',
          active: active === 'settings',
          onClick: () => onNavigate('settings'),
        },
      ]}
    />
  </>
);

/* ---- topbar -------------------------------------------------------------- */

export const TopbarDemo = ({ title }: { title: string }): JSX.Element => {
  const [theme, setTheme] = useState<ThemeName>('light');
  return (
    <>
      <WorkspaceSwitcher workspaces={GROUPS} activeId="og" />
      <div className={topbarDemoTitle()}>
        {title}
      </div>
      <div className={shellDemoSpacer()} />
      <EntityKindsProvider kinds={SUGGESTION_KINDS}>
        <SearchSuggest
          suggestions={SUGGESTIONS}
          className={topbarDemoSearch()}
          hotkey={false}
        />
      </EntityKindsProvider>
      <NotificationsBell notifications={NOTIFICATIONS} />
      <ThemeSwitcher theme={theme} onToggle={setTheme} />
      <ProfileMenu user={USER} />
    </>
  );
};

/* ---- the live shell harness ---------------------------------------------- */

/**
 * Placeholder page content for the shell's content slot. The dashboard
 * pages themselves are app content, not library exports — the stories
 * only need page-shaped filler for the shell to hold.
 */
const PlaceholderPage = ({ id }: { id: string }) => (
  <section aria-label={`${id} placeholder`} className={placeholderPage()}>
    <div className={placeholderPageHeading()} />
    <div className={placeholderPageGrid()}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={placeholderPageCard()}
        />
      ))}
    </div>
    <div className={placeholderPagePanel()} />
  </section>
);

/**
 * The live shell from the original appshell demo: page + collapsed are ONE piece of
 * controlled state each, threaded down. The collapse button belongs to
 * the AppShellTopbar wrapper (the app-shell spec); `withFooter` exercises
 * the optional AppShellContent footer slot.
 */
export const LiveShell = ({
  page: initialPage = 'overview',
  collapsed: initialCollapsed = false,
  withFooter = false,
}: {
  page?: string;
  collapsed?: boolean;
  withFooter?: boolean;
}): JSX.Element => {
  const [page, setPage] = useState(initialPage);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  return (
    <div className={liveShellFrame()}>
      <AppShell>
        <AppShellSidebar collapsed={collapsed}>
          <SidebarDemo active={page} onNavigate={setPage} collapsed={collapsed} />
        </AppShellSidebar>
        <AppShellMain>
          <AppShellTopbar
            sidebarCollapsed={collapsed}
            onToggleSidebar={() => setCollapsed((c) => !c)}
          >
            <TopbarDemo title={page} />
          </AppShellTopbar>
          <AppShellContent
            footer={withFooter
              ? (
                <>
                  <span>© 2026 Acme</span>
                  <a href="#docs">Documentation</a>
                  <a href="#support">Support</a>
                  <a href="#feedback">Feedback</a>
                </>
              )
              : undefined}
          >
            <PlaceholderPage id={page} />
          </AppShellContent>
        </AppShellMain>
      </AppShell>
    </div>
  );
};
