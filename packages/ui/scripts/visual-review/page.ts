/**
 * Renders measured shots as one static HTML page, sorted by the shape of
 * the change and, inside a shape, by shots that changed identically. The
 * page links the diff images in place, so it is read straight from disk.
 */
import { FAINT_MAX_PIXELS, FEW_SPOTS_MAX, FEW_SPOTS_MAX_SHARE, SHAPES, type Shape, type Shot } from './measure';

export type Stability = 'moved' | 'flaked' | 'unknown';

export interface ReviewShot extends Shot {
  readonly stability: Stability;
}

export interface PageInput {
  readonly shots: readonly ReviewShot[];
  readonly generatedAt: string;
  readonly staleDiffFiles: number;
  /** Path from the page to the diff folder, and to the built Storybook. */
  readonly diffHref: string;
  readonly storybookHref: string;
}

const SHAPE_TEXT: Readonly<Record<Shape, { readonly title: string; readonly meaning: string }>> = {
  'size': { title: 'Size changed', meaning: 'The screenshot is a different size from the baseline: the story grew or shrank.' },
  'one-spot': { title: 'One spot', meaning: 'Every changed pixel sits in one area, as a changed label, icon or value would.' },
  'few-spots': { title: 'A few spots', meaning: `${FEW_SPOTS_MAX} or fewer separate areas, covering at most ${FEW_SPOTS_MAX_SHARE * 100}% of the shot.` },
  'spread': { title: 'Spread out', meaning: 'Many areas or a large share of the shot, as a moved layout or a changed colour would.' },
  'faint': { title: 'Faint', meaning: `${FAINT_MAX_PIXELS} changed pixels or fewer, near the run's noise floor: often glyph edges.` },
};

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Splits shots into groups of identical signature, largest group first, then single shots by size. */
export function groupBySignature(shots: readonly ReviewShot[]): readonly (readonly ReviewShot[])[] {
  const groups = new Map<string, ReviewShot[]>();
  for (const shot of shots) groups.set(shot.signature, [...(groups.get(shot.signature) ?? []), shot]);
  return [...groups.values()].sort((a, b) => b.length - a.length || (b[0]?.changedPixels ?? 0) - (a[0]?.changedPixels ?? 0));
}

function describe(shot: ReviewShot): string {
  const box = shot.box === null
    ? 'no changed pixels'
    : `box ${shot.box.width}×${shot.box.height} at ${shot.box.x},${shot.box.y}`;
  const size = shot.sizeChange === null
    ? ''
    : ` · size ${shot.sizeChange}`;
  return `${shot.changedPixels} px · ${shot.spots} spot${shot.spots === 1
    ? ''
    : 's'} · ${box} · ${(shot.share * 100).toFixed(1)}% of shot${size}`;
}

/** Pixels of context kept around a change's box in the zoomed crops. */
export const CROP_PADDING = 12;

/** The widest a zoomed crop is drawn, and the most it is enlarged. */
export const CROP_MAX_WIDTH = 440;
export const CROP_MAX_ZOOM = 4;

const PANELS = ['baseline', 'changed', 'new'] as const;

/** Three zoomed crops of the change's box, cut from the diff image with CSS alone. */
export function renderCrops(shot: ReviewShot, image: string): string {
  if (shot.box === null) return '';
  const left = Math.max(0, shot.box.x - CROP_PADDING);
  const top = Math.max(0, shot.box.y - CROP_PADDING);
  const width = Math.min(shot.panelWidth - left, shot.box.width + CROP_PADDING * 2);
  const height = Math.min(shot.panelHeight - top, shot.box.height + CROP_PADDING * 2);
  const zoom = Math.max(1, Math.min(CROP_MAX_ZOOM, Math.floor(CROP_MAX_WIDTH / width)));
  const crops = PANELS.map((panel, index) => {
    const style = [
      `width:${width * zoom}px`,
      `height:${height * zoom}px`,
      `background-image:url('${image}')`,
      `background-size:${shot.panelWidth * 3 * zoom}px ${shot.panelHeight * zoom}px`,
      `background-position:-${(index * shot.panelWidth + left) * zoom}px -${top * zoom}px`,
    ].join(';');
    return `<div class="crop"><div class="pixels" style="${style}"></div><span>${panel}</span></div>`;
  });
  return `<div class="crops">${crops.join('')}<span class="meta">${zoom}×</span></div>`;
}

function renderShot(shot: ReviewShot, input: PageInput): string {
  const image = `${input.diffHref}/${encodeURIComponent(shot.diffFile)}`;
  const story = `${input.storybookHref}/iframe.html?id=${encodeURIComponent(shot.storyId)}&viewMode=story`;
  return `<figure class="shot">
  <figcaption><strong>${escapeHtml(shot.story)}</strong> <span class="tag ${shot.stability}">${shot.stability}</span> <span class="tag">${escapeHtml(shot.theme)}</span><br>
  <span class="meta">${escapeHtml(describe(shot))}</span> · <a href="${story}">story</a></figcaption>
  ${renderCrops(shot, image)}
  <details><summary>Whole shot</summary><a href="${image}"><img loading="lazy" src="${image}" alt="Baseline, changed pixels and new screenshot for ${escapeHtml(shot.story)}"></a></details>
</figure>`;
}

function renderShape(shape: Shape, shots: readonly ReviewShot[], input: PageInput): string {
  const text = SHAPE_TEXT[shape];
  const groups = groupBySignature(shots).map((group) => group.length === 1
    ? (group[0] === undefined
      ? ''
      : renderShot(group[0], input))
    : `<section class="same"><h3>Same change in ${group.length} shots</h3>${group.map((shot) => renderShot(shot, input)).join('\n')}</section>`);
  return `<section id="${shape}"><h2>${text.title} <small>${shots.length}</small></h2><p>${text.meaning}</p>${groups.join('\n')}</section>`;
}

/** The whole review page. */
export function renderPage(input: PageInput): string {
  const byShape = SHAPES.map((shape) => [shape, input.shots.filter((shot) => shot.shape === shape)] as const);
  const moved = input.shots.filter((shot) => shot.stability === 'moved').length;
  const rows = byShape.map(([shape, shots]) => `<tr><td><a href="#${shape}">${SHAPE_TEXT[shape].title}</a></td><td>${shots.length}</td></tr>`).join('');
  const stale = input.staleDiffFiles === 0
    ? ''
    : `<p>${input.staleDiffFiles} older diff images in the folder belong to no failure of this run and are left out.</p>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Visual review</title>
<style>
:root{--bg:#fbf8f3;--fg:#1d1a16;--muted:#6b645b;--line:#e4ddd2;--moved:#b42318;--flaked:#8a6100}
@media (prefers-color-scheme:dark){:root{--bg:#151311;--fg:#eee8df;--muted:#a59d92;--line:#36312b;--moved:#ff8a7a;--flaked:#e8b84a}}
body{margin:0 auto;max-width:1400px;padding:16px;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,sans-serif}
a{color:inherit}table{border-collapse:collapse}td{border-bottom:1px solid var(--line);padding:4px 12px 4px 0}
h2{margin-top:40px;border-top:1px solid var(--line);padding-top:16px}h2 small{color:var(--muted);font-weight:400}
.same{border-left:3px solid var(--line);padding-left:12px;margin:16px 0}.same h3{font-size:14px;color:var(--muted)}
.shot{margin:12px 0 24px}.shot img{width:100%;height:auto;border:1px solid var(--line)}
.meta{color:var(--muted);font-size:13px}.tag{font-size:12px;border:1px solid var(--line);border-radius:4px;padding:0 5px}
.tag.moved{color:var(--moved)}.tag.flaked{color:var(--flaked)}\n.crops{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;margin:8px 0}.crop{display:flex;flex-direction:column;gap:2px;font-size:12px;color:var(--muted)}\n.pixels{max-width:100%;border:1px solid var(--line);background-repeat:no-repeat;image-rendering:pixelated}\ndetails summary{cursor:pointer;font-size:13px;color:var(--muted)}
</style></head><body>
<h1>Visual review</h1>
<p>${input.shots.length} failed shots, ${moved} of them failed on every pass. Built ${escapeHtml(input.generatedAt)}. Each image shows the baseline, the changed pixels in red, and the new screenshot.</p>
<p>A story is shot light, then dark, and a failed light shot stops the story, so its dark shot was not compared.</p>
${stale}
<table>${rows}</table>
${byShape.filter(([, shots]) => shots.length > 0).map(([shape, shots]) => renderShape(shape, shots, input))
  .join('\n')}
</body></html>
`;
}
