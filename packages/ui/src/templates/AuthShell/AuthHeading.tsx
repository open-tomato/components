import type { FC, ReactNode } from 'react';

import { authHeadingSub, authHeadingTitle } from './AuthShell.variants';

/** Display title + supporting line — the first block inside every auth card. */
export interface AuthHeadingProps {
  title: ReactNode;
  sub?: ReactNode;
}

export const AuthHeading: FC<AuthHeadingProps> = ({ title, sub }: AuthHeadingProps) => (
  <div>
    <h2 className={authHeadingTitle()}>
      {title}
    </h2>
    {sub != null && (
      <div className={authHeadingSub()}>{sub}</div>
    )}
  </div>
);

AuthHeading.displayName = 'AuthHeading';
