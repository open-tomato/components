import type { IconName } from 'lucide-react/dynamic';

import { forwardRef, type HTMLAttributes } from 'react';

import { Icon } from '../../atoms';
import { formatNumber } from '../../lib';
import { SectionCard } from '../SectionCard';

// @@V mol-3 begin
import {
  filesChangedDelta,
  filesChangedIcon,
  filesChangedList,
  filesChangedPath,
  filesChangedRow,
  filesChangedSummary,
  filesChangedTotals,
} from './FilesChanged.variants';
// @@V mol-3 end

export interface FileChange {
  /** File path (mono, truncates from the middle of the card). */
  path: string;
  /** Lines added (`+n`, green). */
  additions: number;
  /** Lines removed (`-n`, red). */
  deletions: number;
  /** File-type icon override; inferred from the extension otherwise. */
  icon?: IconName;
}

export interface FilesChangedProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  files: FileChange[];
  /** Card title (defaults to "Files changed"). */
  title?: string;
  locale?: string;
}

/** Extension → lucide file-type glyph (data-driven via the 03a Icon). */
const EXTENSION_ICONS: Record<string, IconName> = {
  ts: 'file-code',
  tsx: 'file-code',
  js: 'file-code',
  jsx: 'file-code',
  mjs: 'file-code',
  py: 'file-code',
  go: 'file-code',
  rs: 'file-code',
  css: 'file-code',
  scss: 'file-code',
  html: 'file-code',
  json: 'file-json',
  md: 'file-text',
  txt: 'file-text',
  png: 'file-image',
  jpg: 'file-image',
  jpeg: 'file-image',
  gif: 'file-image',
  svg: 'file-image',
  webp: 'file-image',
  sh: 'file-terminal',
  zsh: 'file-terminal',
  yml: 'file-cog',
  yaml: 'file-cog',
  toml: 'file-cog',
  lock: 'file-lock',
};

const iconFor = (file: FileChange): IconName => {
  if (file.icon != null) return file.icon;
  const extension = file.path
    .split('.')
    .pop()
    ?.toLowerCase() ?? '';
  return EXTENSION_ICONS[extension] ?? 'file';
};

// @@S mol-3 begin
/**
 * FilesChanged — the "files touched" card (detail views, PR summaries).
 * Spec: "FilesChanged" (no design artboard):
 * header carries the file count + total additions (green) and deletions
 * (red); each row shows a file-type icon, the path, and `+n` / `-n`.
 *
 * Interpretation decision: zero deltas render dimmed (`+0`/`-0` at half
 * opacity) so the columns stay scannable without shouting zeros.
 */
// @@S mol-3 end
// @@T mol-3 begin
export const FilesChanged: import('react').ForwardRefExoticComponent<
  FilesChangedProps & import('react').RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, FilesChangedProps>(
// @@T mol-3 end
  ({ className, files, title = 'Files changed', locale, ...props }, ref) => {
    const additions = files.reduce((acc, f) => acc + f.additions, 0);
    const deletions = files.reduce((acc, f) => acc + f.deletions, 0);
    const format = (value: number): string => formatNumber(value, { locale });
    return (
      <SectionCard
        ref={ref}
        title={title}
        className={className}
        padded={false}
        action={
          // @@V mol-3 begin
          <div className={filesChangedTotals()}>
            {/* @@V mol-3 end */}
            <span className={filesChangedSummary()}>
              {files.length === 1
                ? '1 file'
                : `${format(files.length)} files`}
            </span>
            <span className={filesChangedSummary({ kind: 'additions' })}>
              {`+${format(additions)}`}
            </span>
            <span className={filesChangedSummary({ kind: 'deletions' })}>
              {`-${format(deletions)}`}
            </span>
          </div>
        }
        {...props}
      >
        {/* @@V mol-3 begin */}
        <ul className={filesChangedList()}>
          {files.map((file) => (
            <li
              key={file.path}
              className={filesChangedRow()}
            >
              <Icon name={iconFor(file)} size={14} className={filesChangedIcon()} />
              {/* @@V mol-3 end */}
              <span className={filesChangedPath()} title={file.path}>
                {file.path}
              </span>
              <span
                className={filesChangedDelta({
                  kind: 'additions',
                  zero: file.additions === 0,
                })}
              >
                {`+${format(file.additions)}`}
              </span>
              <span
                className={filesChangedDelta({
                  kind: 'deletions',
                  zero: file.deletions === 0,
                })}
              >
                {`-${format(file.deletions)}`}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>
    );
  },
);

FilesChanged.displayName = 'FilesChanged';
