// @@T ato-3 begin
import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type HTMLAttributes } from 'react';
// @@T ato-3 end

import { cn, initials } from '../../lib';

// @@V ato-3 begin
import { avatar, avatarRoot, avatarStatus, type AvatarVariants } from './Avatar.variants';
// @@V ato-3 end

export interface AvatarProps
  extends HTMLAttributes<HTMLSpanElement>,
  AvatarVariants {
  /** Identity the mark stands for; initials are derived from it. */
  name: string;
}

// @@T ato-3 begin
export const Avatar: ForwardRefExoticComponent<
  AvatarProps & RefAttributes<HTMLSpanElement>
> = forwardRef<
// @@T ato-3 end
  HTMLSpanElement, AvatarProps>(
  ({ className, name, size, shape, status, ...props }, ref) => (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      // @@V ato-3 begin
      className={cn(avatarRoot(), className)}
      // @@V ato-3 end
      {...props}
    >
      <span className={avatar({ size, shape })}>{initials(name)}</span>
      <span className={avatarStatus({ status, size })} aria-hidden />
    </span>
  ),
);

Avatar.displayName = 'Avatar';
