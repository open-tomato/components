import type { IconName } from '../../atoms/Icon';

import { forwardRef, type HTMLAttributes } from 'react';

import { Icon } from '../../atoms/Icon';
import { cn } from '../../lib';

import {
  modelFooter,
  modelFooterName,
} from './KnownEntities.variants';

export interface ModelFooterProps extends HTMLAttributes<HTMLSpanElement> {
  /** Model name. */
  name: string;
  /** Small leading glyph (defaults to `cpu`). */
  icon?: IconName;
}

/**
 * `model-footer` — small icon + model name that INHERITS the footer's
 * color wholesale — no accent of its own (spec: the component spec
 * "Known Entities"; sits inside SectionCard footers, which set the
 * greyed footer color).
 */
export const ModelFooter: import('react').ForwardRefExoticComponent<
  ModelFooterProps & import('react').RefAttributes<HTMLSpanElement>
> = forwardRef<HTMLSpanElement, ModelFooterProps>(
  ({ className, name, icon = 'cpu', ...props }, ref) => (
    <span ref={ref} className={cn(modelFooter(), className)} {...props}>
      <Icon name={icon} size={12} />
      <span className={modelFooterName()}>{name}</span>
    </span>
  ),
);

ModelFooter.displayName = 'ModelFooter';
