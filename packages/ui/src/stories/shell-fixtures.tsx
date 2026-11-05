// @@T tpl-1 begin
import type { JSX } from 'react';

// @@T tpl-1 end
import { useState } from 'react';

import { TomatoMark } from '../internal/TomatoMark';
import { cn } from '../lib';
// @@S mol-3 begin
import { EntityKindsProvider } from '../molecules/KnownEntities/EntityKinds';
import { type EntityKinds } from '../molecules/KnownEntities/entityKindsContext';
// @@S mol-3 end
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
  SidebarWeekSummary,
  type SidebarNavConfigItem,
} from '../templates/AppShell';

// @@V tpl-1 begin
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
// @@V tpl-1 end
import {
  WorkspaceSwitcher,
  type WorkspaceOption,
} from './WorkspaceSwitcher';

/**
 * Story harness for the AppShell stories. The chrome is the REAL library
 * components — WorkspaceSwitcher, SearchSuggest, NotificationsBell,
 * ThemeSwitcher, ProfileMenu in the topbar; SidebarNav +
 * SidebarWeekSummary + SidebarQuickAccess in the rail — this file only
 * supplies demo data, placeholder page content and the LiveShell wiring.
 * The shell remains; the page content changes.
 */

/* ---- demo data ----------------------------------------------------------- */

/** Nav as data (the app-shell spec icons). */
// eslint-disable-next-line react-refresh/only-export-components -- story fixture module mixing demo components and nav data; fast refresh does not apply
export const NAV_PRIMARY: SidebarNavConfigItem[] = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
  { id: 'sessions', label: 'Sessions', icon: 'terminal' },
  { id: 'agents', label: 'Agents', icon: 'bot' },
  { id: 'roadmap', label: 'Roadmap', icon: 'list' },
  { id: 'tools', label: 'Tools', icon: 'cpu' },
  { id: 'usage', label: 'Usage', icon: 'zap' },
];

const WORKSPACES: WorkspaceOption[] = [
  { id: 'og', name: 'open-garden', members: 12, tone: 'accent' },
  { id: 'rt', name: 'ripe-tomatoes', members: 6, tone: 'primary' },
  { id: 'vp', name: 'vine-patch', members: 3, tone: 'gold' },
];

// @@S mol-3 begin
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
// @@S mol-3 end

const NOTIFICATIONS: NotificationItem[] = [
  { id: 1, unread: true, level: 'ok', title: 'auth-refactor finished', body: '8 files updated · 12.3k tokens', time: '2m ago' },
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
// @@T tpl-1 begin
}): JSX.Element => (
// @@T tpl-1 end
  <>
    <div
      // @@V tpl-1 begin
      className={cn(sidebarDemoBrand({ collapsed }))}
      // @@V tpl-1 end
    >
      <TomatoMark size={26} />
      {!collapsed && (
        // @@V tpl-1 begin
        <span className={sidebarDemoWordmark()}>
          <span className={sidebarDemoWordmarkOpen()}>open</span>{' '}
          <span className={sidebarDemoWordmarkTomato()}>tomato</span>
          {/* @@V tpl-1 end */}
        </span>
      )}
    </div>
    <SidebarNav
      items={NAV_PRIMARY}
      activeId={active}
      onNavigate={onNavigate}
      collapsed={collapsed}
    />
    {/* @@V tpl-1 begin */}
    <div className={shellDemoSpacer()} />
    {/* @@V tpl-1 end */}
    <SidebarWeekSummary
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

// @@T tpl-1 begin
export const TopbarDemo = ({ title }: { title: string }): JSX.Element => {
// @@T tpl-1 end
  const [theme, setTheme] = useState<ThemeName>('light');
  return (
    <>
      <WorkspaceSwitcher workspaces={WORKSPACES} activeId="og" />
      {/* @@V tpl-1 begin */}
      <div className={topbarDemoTitle()}>
        {title}
      </div>
      <div className={shellDemoSpacer()} />
      {/* @@S mol-3 begin */}
      <EntityKindsProvider kinds={SUGGESTION_KINDS}>
        {/* @@S mol-3 end */}
        <SearchSuggest
          suggestions={SUGGESTIONS}
          className={topbarDemoSearch()}
          // @@V tpl-1 end
          hotkey={false}
        />
        {/* @@S mol-3 begin */}
      </EntityKindsProvider>
      {/* @@S mol-3 end */}
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
  // @@V tpl-1 begin
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
    {/* @@V tpl-1 end */}
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
// @@T tpl-1 begin
}): JSX.Element => {
// @@T tpl-1 end
  const [page, setPage] = useState(initialPage);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  return (
    // @@V tpl-1 begin
    <div className={liveShellFrame()}>
      {/* @@V tpl-1 end */}
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
