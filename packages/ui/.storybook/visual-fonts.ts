import type { BrowserContext, Page, Route } from 'playwright';

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Font pin for the visual suite. `src/styles/fonts.css` loads the type
 * faces from Google Fonts, and two things about that made text draw
 * differently from pass to pass:
 *
 * 1. Google answers that one CSS URL in two forms. Most answers point at
 *    static files (`fonts.gstatic.com/s/…`); some point at files generated
 *    per request (`fonts.gstatic.com/l/font?kit=…`). The two sets draw the
 *    same glyphs at the same places but rasterise their edges differently,
 *    so a shot taken with the generated set fails against a baseline taken
 *    with the static set (measured 21 to 425 changed pixels per shot).
 *    Measured on 2026-11-10: 3 of 40 fetches came back generated, and
 *    forcing that answer into a fresh page reproduced failed shots byte
 *    for byte.
 * 2. The test runner opens one browser context per story file, and each
 *    context fetches the CSS and the font files again. One generated
 *    answer, or one fetch slower than the story's timeout, failed every
 *    story of that file together.
 *
 * So the pin answers both requests from a disk cache next to the
 * baselines. A URL missing from the cache is fetched once, retried until
 * the answer is accepted (CSS: every font URL static; font file: an OK
 * answer), and stored. Like the baselines, the cache belongs to this
 * machine: delete `visual/__font_cache__/` to fetch the fonts again, and
 * reseed the baselines if Google has moved to new font versions since.
 */

/** The CSS request every story page makes; `**` covers the family query. */
const GOOGLE_FONTS_CSS = 'https://fonts.googleapis.com/css2?**';

/** Static font files; the generated ones live under `/l/font?kit=`. */
const STATIC_FONT_PREFIX = 'https://fonts.gstatic.com/s/';
const STATIC_FONT_FILES = `${STATIC_FONT_PREFIX}**`;

/**
 * Fetches before giving up on one URL. About 1 CSS answer in 13 is
 * generated, so ten rejected answers in a row is not expected; when it
 * happens the request is aborted, and the shots fail loudly instead of
 * drawing with other fonts.
 */
const MAX_FETCH_ATTEMPTS = 10;

/** Each fetch's own limit, so a dead network costs at most 10 × 5 s. */
const FETCH_TIMEOUT_MS = 5_000;

/** Per-environment, like the baselines; `visual/` is gitignored. */
const FONT_CACHE_DIR = join(process.cwd(), 'visual', '__font_cache__');

const FONT_URL = /url\(\s*['"]?([^'")\s]+)/g;

/** True when the CSS names at least one font file and every one is static. */
export function isStaticGoogleFontsCss(css: string): boolean {
  const urls = [...css.matchAll(FONT_URL)].map((match) => match[1] ?? '');
  return urls.length > 0 && urls.every((url) => url.startsWith(STATIC_FONT_PREFIX));
}

/**
 * Calls `fetchOnce` until `accept` takes its answer, at most `attempts`
 * times. A call that throws counts as one attempt and is passed to
 * `onError`. Returns the accepted answer, or undefined when none came.
 */
export async function firstAcceptedAnswer<T>(
  fetchOnce: () => Promise<T>,
  accept: (answer: T) => boolean,
  attempts: number = MAX_FETCH_ATTEMPTS,
  onError: (error: unknown) => void = () => {},
): Promise<T | undefined> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const answer = await fetchOnce();
      if (accept(answer)) return answer;
    } catch (error: unknown) {
      onError(error);
    }
  }
  return undefined;
}

/** One stored response: what the cache keeps per URL. */
export interface CachedResponse {
  contentType: string;
  body: Buffer;
}

interface StoredEntry {
  url: string;
  contentType: string;
  body: string;
}

function cacheFile(dir: string, url: string): string {
  const key = createHash('sha256').update(url)
    .digest('hex');
  return join(dir, `${key}.json`);
}

/** The stored response for `url`, or undefined when none is stored. */
export function readCachedResponse(dir: string, url: string): CachedResponse | undefined {
  let raw: string;
  try {
    raw = readFileSync(cacheFile(dir, url), 'utf8');
  } catch {
    return undefined;
  }
  const entry = JSON.parse(raw) as StoredEntry;
  return { contentType: entry.contentType, body: Buffer.from(entry.body, 'base64') };
}

/**
 * Stores `response` for `url`. Writes a temporary file and renames it, so
 * two test workers storing the same URL never leave a half-written entry.
 */
export function writeCachedResponse(dir: string, url: string, response: CachedResponse): void {
  mkdirSync(dir, { recursive: true });
  const target = cacheFile(dir, url);
  const temporary = `${target}.${process.pid}.tmp`;
  const entry: StoredEntry = { url, contentType: response.contentType, body: response.body.toString('base64') };
  writeFileSync(temporary, JSON.stringify(entry));
  renameSync(temporary, target);
}

interface FetchedResponse extends CachedResponse {
  ok: boolean;
}

/** Answers the request from the cache, filling it on a miss. */
async function answerFromCache(route: Route, accept: (answer: FetchedResponse) => boolean): Promise<void> {
  const url = route.request().url();
  const cached = readCachedResponse(FONT_CACHE_DIR, url);
  const answer = cached ?? await firstAcceptedAnswer(
    async (): Promise<FetchedResponse> => {
      const response = await route.fetch({ timeout: FETCH_TIMEOUT_MS });
      return { ok: response.ok(), contentType: response.headers()['content-type'] ?? '', body: await response.body() };
    },
    accept,
    MAX_FETCH_ATTEMPTS,
    (error) => process.stderr.write(`visual-fonts: fetch of ${url} failed: ${String(error)}\n`),
  );
  if (answer === undefined) {
    process.stderr.write(`visual-fonts: no accepted answer for ${url} after ${MAX_FETCH_ATTEMPTS} attempts; aborting it so the shots fail instead of drawing with other fonts\n`);
    await route.abort('failed');
    return;
  }
  if (cached === undefined) writeCachedResponse(FONT_CACHE_DIR, url, answer);
  // The page is cross-origin to both hosts; font loads need CORS.
  await route.fulfill({
    status: 200,
    contentType: answer.contentType,
    headers: { 'access-control-allow-origin': '*' },
    body: answer.body,
  });
}

/** Routes the context's Google Fonts CSS and static font files through the cache. */
async function pinGoogleFonts(context: BrowserContext): Promise<void> {
  await context.route(GOOGLE_FONTS_CSS, (route) => answerFromCache(
    route,
    (answer) => answer.ok && isStaticGoogleFontsCss(answer.body.toString('utf8')),
  ));
  await context.route(STATIC_FONT_FILES, (route) => answerFromCache(
    route,
    (answer) => answer.ok && answer.body.length > 0,
  ));
}

/** The page and context the test runner hands its `prepare` hook. */
interface PrepareContext {
  page: Page;
  browserContext: BrowserContext;
}

/**
 * The test runner's `prepare` hook: the runner's own preparation (open
 * `iframe.html` on TARGET_URL and wait for load) with the font pin set on
 * the context first, so the first font request already goes through it.
 * The runner's default also applies a config `getHttpHeaders`; this
 * config defines none, so add that here if one is ever introduced.
 */
export async function prepareWithStaticFonts({ page, browserContext }: PrepareContext): Promise<void> {
  await pinGoogleFonts(browserContext);
  const iframeUrl = new URL('iframe.html', process.env.TARGET_URL).toString();
  await page.goto(iframeUrl, { waitUntil: 'load' });
}
