import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from 'react';

import { Icon } from '../../atoms/Icon';
import { IconButton } from '../../atoms/IconButton';
import { cn } from '../../lib';

import {
  appShell,
  appShellBrand,
  appShellBrandWordmark,
  appShellContent,
  appShellFooter,
  appShellMain,
  appShellSidebar,
  appShellSpacer,
  appShellTitle,
  appShellToggle,
  appShellTopbar,
  type AppShellBrandVariants,
  type AppShellSidebarVariants,
} from './AppShell.variants';

/**
 * Compound API — the shell is layout only; everything inside the zones is
 * components from earlier chapters:
 *
 *   <AppShell>
 *     <AppShellSidebar collapsed={collapsed}>
 *       <AppShellBrand collapsed={collapsed} mark={…} wordmark="…" />
 *       <SidebarNav … />
 *       <AppShellSpacer />
 *       …SidebarQuota, SidebarQuickAccess…
 *     </AppShellSidebar>
 *     <AppShellMain>
 *       <AppShellTopbar onToggleSidebar={…} sidebarCollapsed={collapsed}>
 *         <AppShellTitle>…</AppShellTitle>
 *         …search, Menu-driven buttons, at the far end…
 *       </AppShellTopbar>
 *       <AppShellContent footer={…}>{page}</AppShellContent>
 *     </AppShellMain>
 *   </AppShell>
 *
 * Controlled throughout: the active page and `collapsed` live in the parent
 * and are threaded down — exactly like `open` on the surfaces and `query`
 * on the toolbar. Per the app-shell spec the sidebar collapse BUTTON belongs
 * to the topbar wrapper itself (`onToggleSidebar`), not to page chrome.
 */

export type AppShellProps = HTMLAttributes<HTMLDivElement>;

export const AppShell: ForwardRefExoticComponent<
  AppShellProps & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement, AppShellProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(appShell(), className)} {...props} />
  ),
);

AppShell.displayName = 'AppShell';

export interface AppShellBrandProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
  AppShellBrandVariants {
  /** The brand's mark, such as a `Monogram`; shown in both rail widths. */
  mark?: ReactNode;
  /** The brand's name beside the mark; hidden when `collapsed`. */
  wordmark?: ReactNode;
}

/**
 * The rail's brand row: the mark and the wordmark, as tall as the topbar
 * and with the same divider, so the two line up. Pass the rail's
 * `collapsed` so the row centres the mark and drops the wordmark.
 */
export const AppShellBrand: ForwardRefExoticComponent<
  AppShellBrandProps & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement, AppShellBrandProps>(
  ({ className, collapsed, mark, wordmark, ...props }, ref) => (
    <div ref={ref} className={cn(appShellBrand({ collapsed }), className)} {...props}>
      {mark}
      {collapsed !== true && wordmark != null && (
        <span className={appShellBrandWordmark()}>{wordmark}</span>
      )}
    </div>
  ),
);

AppShellBrand.displayName = 'AppShellBrand';

export interface AppShellSidebarProps
  extends HTMLAttributes<HTMLElement>,
  AppShellSidebarVariants {}

export const AppShellSidebar: ForwardRefExoticComponent<
  AppShellSidebarProps & RefAttributes<HTMLElement>
> = forwardRef<
  HTMLElement, AppShellSidebarProps>(
  ({ className, collapsed, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(appShellSidebar({ collapsed }), className)}
      {...props}
    />
  ),
);

AppShellSidebar.displayName = 'AppShellSidebar';

export type AppShellMainProps = HTMLAttributes<HTMLElement>;

export const AppShellMain: ForwardRefExoticComponent<
  AppShellMainProps & RefAttributes<HTMLElement>
> = forwardRef<
  HTMLElement, AppShellMainProps>(
  ({ className, ...props }, ref) => (
    <main ref={ref} className={cn(appShellMain(), className)} {...props} />
  ),
);

AppShellMain.displayName = 'AppShellMain';

export interface AppShellTopbarProps extends HTMLAttributes<HTMLElement> {
  /**
   * When provided, the wrapper renders the sidebar collapse button as its
   * first child (app-shell spec: — the collapse button is part of
   * the main topbar wrapper, not page chrome).
   */
  onToggleSidebar?: () => void;
  /** Drives the toggle's accessible name (Expand vs Collapse). */
  sidebarCollapsed?: boolean;
}

export const AppShellTopbar: ForwardRefExoticComponent<
  AppShellTopbarProps & RefAttributes<HTMLElement>
> = forwardRef<
  HTMLElement, AppShellTopbarProps>(
  (
    { className, onToggleSidebar, sidebarCollapsed = false, children, ...props },
    ref,
  ) => (
    <header ref={ref} className={cn(appShellTopbar(), className)} {...props}>
      {onToggleSidebar != null && (
        <IconButton
          className={appShellToggle()}
          icon={<Icon name="panel-left" size={18} />}
          label={sidebarCollapsed
            ? 'Expand sidebar'
            : 'Collapse sidebar'}
          onClick={onToggleSidebar}
        />
      )}
      {children}
    </header>
  ),
);

AppShellTopbar.displayName = 'AppShellTopbar';

export type AppShellTitleProps = HTMLAttributes<HTMLHeadingElement>;

/**
 * The topbar's page title, as the page's `h1`. It takes the band's free
 * space, so the controls after it sit at the far end, and it ellipsizes a
 * long title instead of pushing them out.
 */
export const AppShellTitle: ForwardRefExoticComponent<
  AppShellTitleProps & RefAttributes<HTMLHeadingElement>
> = forwardRef<
  HTMLHeadingElement, AppShellTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h1 ref={ref} className={cn(appShellTitle(), className)} {...props}>
      {children}
    </h1>
  ),
);

AppShellTitle.displayName = 'AppShellTitle';

export type AppShellSpacerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/**
 * Takes the free space of the zone it sits in, pushing what follows to the
 * far end: in the rail, the quota and quick-access blocks to its foot.
 */
export const AppShellSpacer: ForwardRefExoticComponent<
  AppShellSpacerProps & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement, AppShellSpacerProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} aria-hidden="true" className={cn(appShellSpacer(), className)} {...props} />
  ),
);

AppShellSpacer.displayName = 'AppShellSpacer';

export interface AppShellContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Optional shell-level footer (app-shell spec: Main Content):
   * copyright + general links, rendered at the end of the scroll flow.
   */
  footer?: ReactNode;
}

export const AppShellContent: ForwardRefExoticComponent<
  AppShellContentProps & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement, AppShellContentProps>(
  ({ className, footer, children, ...props }, ref) => (
    <div ref={ref} className={cn(appShellContent(), className)} {...props}>
      {children}
      {footer != null && <footer className={appShellFooter()}>{footer}</footer>}
    </div>
  ),
);

AppShellContent.displayName = 'AppShellContent';
