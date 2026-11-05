// @@T tpl-1 begin
import type { FC, ReactNode } from 'react';
// @@T tpl-1 end

/** Display title + supporting line — the first block inside every auth card. */
export interface AuthHeadingProps {
  title: ReactNode;
  sub?: ReactNode;
}

// @@T tpl-1 begin
export const AuthHeading: FC<AuthHeadingProps> = ({ title, sub }: AuthHeadingProps) => (
// @@T tpl-1 end
  <div>
    <h2 className="!m-0 font-display !text-[26px] font-bold !tracking-[-0.02em] !leading-[normal] text-balance text-fg1">
      {title}
    </h2>
    {sub != null && (
      <div className="mt-1.5 text-sm leading-normal text-pretty text-fg2">{sub}</div>
    )}
  </div>
);

AuthHeading.displayName = 'AuthHeading';
