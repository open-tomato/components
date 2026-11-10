import type { BrowserContext, Page } from 'playwright';

/**
 * Font pin for the visual suite. `src/styles/fonts.css` loads the type
 * faces from Google Fonts, and Google answers that one CSS URL in two
 * forms: most answers point at static files (`fonts.gstatic.com/s/…`),
 * and some point at files generated per request
 * (`fonts.gstatic.com/l/font?kit=…`). The two sets of files draw the same
 * glyphs at the same places but rasterise their edges differently, so a
 * shot taken with the generated set fails against a baseline taken with
 * the static set (measured 21 to 425 changed pixels per shot, far over the
 * 20-pixel limit).
 *
 * The test runner opens one browser context per story file, and each
 * context fetches the CSS once, so one generated answer used to fail
 * every story of that file together. Measured on 2026-11-10: 3 of 40
 * fetches came back generated, and forcing that answer into a fresh page
 * reproduced the failed shots byte for byte.
 *
 * The pin keeps the network path and refetches the CSS until it gets a
 * static answer, so every context draws with the same files.
 */

/** The CSS request every story page makes; `**` covers the family query. */
const GOOGLE_FONTS_CSS = 'https://fonts.googleapis.com/css2?**';

/** Static font files; the generated ones live under `/l/font?kit=`. */
const STATIC_FONT_PREFIX = 'https://fonts.gstatic.com/s/';

/**
 * Refetches before giving up. About 1 answer in 13 is generated, so ten
 * generated answers in a row is not expected to happen; when it does,
 * the request is aborted rather than let a generated answer through.
 */
const MAX_CSS_ATTEMPTS = 10;

const FONT_URL = /url\(\s*['"]?([^'")\s]+)/g;

/** True when the CSS names at least one font file and every one is static. */
export function isStaticGoogleFontsCss(css: string): boolean {
  const urls = [...css.matchAll(FONT_URL)].map((match) => match[1] ?? '');
  return urls.length > 0 && urls.every((url) => url.startsWith(STATIC_FONT_PREFIX));
}

/** The parts of a fetched CSS answer the pin decides on. */
export interface CssAnswer {
  ok: boolean;
  body: string;
}

/**
 * Calls `fetchOnce` until it returns an OK answer with static faces, at
 * most `attempts` times. Returns that answer, or undefined when none came.
 */
export async function firstStaticAnswer<T extends CssAnswer>(
  fetchOnce: () => Promise<T>,
  attempts: number = MAX_CSS_ATTEMPTS,
): Promise<T | undefined> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const answer = await fetchOnce();
    if (answer.ok && isStaticGoogleFontsCss(answer.body)) return answer;
  }
  return undefined;
}

/** Routes the context's Google Fonts CSS request through the static-only pin. */
async function pinStaticGoogleFonts(context: BrowserContext): Promise<void> {
  await context.route(GOOGLE_FONTS_CSS, async (route) => {
    const answer = await firstStaticAnswer(async () => {
      const response = await route.fetch();
      return { ok: response.ok(), body: await response.text(), response };
    });
    if (answer === undefined) {
      process.stderr.write(
        `visual-fonts: no static Google Fonts CSS after ${MAX_CSS_ATTEMPTS} fetches of ${route.request().url()}; aborting the request so the shots fail instead of drawing with generated fonts\n`,
      );
      await route.abort('failed');
      return;
    }
    await route.fulfill({ response: answer.response, body: answer.body });
  });
}

/** The page and context the test runner hands its `prepare` hook. */
interface PrepareContext {
  page: Page;
  browserContext: BrowserContext;
}

/**
 * The test runner's `prepare` hook: the runner's own preparation (open
 * `iframe.html` on TARGET_URL and wait for load) with the font pin set on
 * the context first, so the first CSS request already goes through it.
 */
export async function prepareWithStaticFonts({ page, browserContext }: PrepareContext): Promise<void> {
  await pinStaticGoogleFonts(browserContext);
  const iframeUrl = new URL('iframe.html', process.env.TARGET_URL).toString();
  await page.goto(iframeUrl, { waitUntil: 'load' });
}
