import {
  forwardRef,
  type FC,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from 'react';

import { cn } from '../../lib';

import {
  toolbarControls,
  toolbarSummary,
  toolbarSurface,
  type ToolbarSummaryVariants,
} from './Toolbar.variants';

/**
 * Compound API:
 *
 *   <Toolbar>
 *     <ToolbarControls>
 *       <SearchInput … />
 *       <FilterDropdown … />
 *       <ToolbarSep />
 *       <Select … />
 *     </ToolbarControls>
 *     <ToolbarSummary divided={attached}>…count + chips…</ToolbarSummary>
 *     {attached && <Table frame={false} … />}
 *   </Toolbar>
 *
 * Controlled throughout — the parent owns query/filters/density and derives
 * the rows; the toolbar only presents them.
 */

export type ToolbarProps = HTMLAttributes<HTMLDivElement>;

// @@T org-2 begin
export const Toolbar: ForwardRefExoticComponent<ToolbarProps & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, ToolbarProps>(
// @@T org-2 end

  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(toolbarSurface(), className)} {...props} />
  ),
);

Toolbar.displayName = 'Toolbar';

export type ToolbarControlsProps = HTMLAttributes<HTMLDivElement>;

// @@T org-2 begin
export const ToolbarControls: ForwardRefExoticComponent<ToolbarControlsProps & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, ToolbarControlsProps>(
// @@T org-2 end

  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(toolbarControls(), className)} {...props} />
  ),
);

ToolbarControls.displayName = 'ToolbarControls';

export interface ToolbarSummaryProps
  extends HTMLAttributes<HTMLDivElement>,
  ToolbarSummaryVariants {}

// @@T org-2 begin
export const ToolbarSummary: ForwardRefExoticComponent<ToolbarSummaryProps & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, ToolbarSummaryProps>(
// @@T org-2 end

  ({ className, divided, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(toolbarSummary({ divided }), className)}
      {...props}
    />
  ),
);

ToolbarSummary.displayName = 'ToolbarSummary';

/** The vertical hairline between control clusters. */
// @@T org-2 begin
export const ToolbarSep: FC<{ className?: string }> = ({ className }) => (
// @@T org-2 end

  <div
    aria-hidden
    className={cn('mx-0.5 w-px self-stretch bg-border-soft', className)}
  />
);

ToolbarSep.displayName = 'ToolbarSep';
