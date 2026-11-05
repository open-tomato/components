import type { ClassProp } from 'class-variance-authority/types';

import { cva } from 'class-variance-authority';

/**
 * ProfileMenu — the classes of the account menu: the bare Avatar trigger,
 * the identity header and the item sections. No variant axes: every slot
 * renders one fixed class list.
 */

/** The menu trigger: a bare round button around the Avatar. */
export const profileMenuTrigger: (props?: ClassProp | undefined) => string = cva('cursor-pointer rounded-full border-none bg-transparent p-0');

/** The menu panel: fixed width, sections carry their own padding. */
export const profileMenuContent: (props?: ClassProp | undefined) => string = cva('w-[260px] p-0');

/** The identity header: avatar beside name, email and role. */
export const profileMenuHeader: (props?: ClassProp | undefined) => string = cva('flex items-center gap-2.5 border-b border-border-soft p-3.5');

/** The identity text column, allowed to shrink so the email truncates. */
export const profileMenuIdentity: (props?: ClassProp | undefined) => string = cva('min-w-0');

/** The user's name. */
export const profileMenuName: (props?: ClassProp | undefined) => string = cva('text-sm font-bold text-fg1');

/** The user's email, mono and truncated. */
export const profileMenuEmail: (props?: ClassProp | undefined) => string = cva('truncate font-mono text-xs text-fg3');

/** The role badge row. */
export const profileMenuRole: (props?: ClassProp | undefined) => string = cva('mt-1');

/** The navigation items section. */
export const profileMenuItems: (props?: ClassProp | undefined) => string = cva('flex flex-col gap-px p-1.5');

/** The separator above logout, flush with the sections. */
export const profileMenuSep: (props?: ClassProp | undefined) => string = cva('my-0');

/** The logout section (the item or its inline confirm). */
export const profileMenuLogout: (props?: ClassProp | undefined) => string = cva('p-1.5');
