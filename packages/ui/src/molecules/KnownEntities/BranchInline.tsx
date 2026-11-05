import { forwardRef, type HTMLAttributes } from 'react';

import { Icon } from '../../atoms/Icon';
import { cn } from '../../lib';

// @@V mol-3 begin
import { branchInline, branchInlineName } from './KnownEntities.variants';
// @@V mol-3 end

export interface BranchInlineProps extends HTMLAttributes<HTMLSpanElement> {
  /** Branch name. */
  name: string;
}

/**
 * `branch-inline` — the `git-branch` Lucide glyph + branch name (spec:
 * "Known Entities").
 */
// @@T mol-3 begin
export const BranchInline: import('react').ForwardRefExoticComponent<
  BranchInlineProps & import('react').RefAttributes<HTMLSpanElement>
> = forwardRef<HTMLSpanElement, BranchInlineProps>(
// @@T mol-3 end
  ({ className, name, ...props }, ref) => (
    <span ref={ref} className={cn(branchInline(), className)} {...props}>
      <Icon name="git-branch" size={10} />
      {/* @@V mol-3 begin */}
      <span className={branchInlineName()}>{name}</span>
      {/* @@V mol-3 end */}
    </span>
  ),
);

BranchInline.displayName = 'BranchInline';
