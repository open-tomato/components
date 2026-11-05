// @@T tpl-1 begin
import type { FC, ReactNode } from 'react';
// @@T tpl-1 end

// @@V tpl-1 begin
import { authHeadingSub, authHeadingTitle } from './AuthShell.variants';
// @@V tpl-1 end

/** Display title + supporting line — the first block inside every auth card. */
export interface AuthHeadingProps {
  title: ReactNode;
  sub?: ReactNode;
}

// @@T tpl-1 begin
export const AuthHeading: FC<AuthHeadingProps> = ({ title, sub }: AuthHeadingProps) => (
// @@T tpl-1 end
  <div>
    {/* @@V tpl-1 begin */}
    <h2 className={authHeadingTitle()}>
      {title}
    </h2>
    {sub != null && (
      <div className={authHeadingSub()}>{sub}</div>
    )}
    {/* @@V tpl-1 end */}
  </div>
);

AuthHeading.displayName = 'AuthHeading';
