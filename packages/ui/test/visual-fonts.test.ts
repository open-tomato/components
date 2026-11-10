/**
 * The visual suite's font pin (`.storybook/visual-fonts.ts`): Google Fonts
 * answers the same CSS URL in two forms, static `/s/` files or generated
 * `/l/font?kit=` files, and the two draw text differently. The pin keeps
 * only static answers, refetching until one arrives, and keeps every
 * accepted answer in a disk cache so later pages never touch the network.
 */
import { existsSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

import {
  answerFromCache,
  firstAcceptedAnswer,
  isStaticGoogleFontsCss,
  readCachedResponse,
  writeCachedResponse,
} from '../.storybook/visual-fonts';

const STATIC_FACE = `@font-face {
  font-family: 'Manrope';
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/manrope/v23/static-face.woff2) format('woff2');
}`;

const KIT_FACE = `@font-face {
  font-family: 'Manrope';
  font-weight: 400;
  src: url(https://fonts.gstatic.com/l/font?kit=generated-face&skey=0&v=v23) format('woff2');
}`;

interface Answer {
  ok: boolean;
  body: string;
}

const isStaticAnswer = (answer: Answer) => answer.ok && isStaticGoogleFontsCss(answer.body);

/** A fetcher that hands out the given answers in order and counts its calls. */
function scripted(answers: Answer[]) {
  let calls = 0;
  const fetchOnce = async (): Promise<Answer> => {
    const answer = answers[Math.min(calls, answers.length - 1)];
    calls += 1;
    if (answer === undefined) throw new Error('scripted fetcher has no answers');
    return answer;
  };
  return { fetchOnce, calls: () => calls };
}

function freshCacheDir(): string {
  return join(mkdtempSync(join(tmpdir(), 'visual-fonts-')), 'cache');
}

describe('isStaticGoogleFontsCss', () => {
  it('accepts CSS whose every face is a static file', () => {
    // Arrange
    const css = `${STATIC_FACE}\n${STATIC_FACE}`;

    // Act
    const accepted = isStaticGoogleFontsCss(css);

    // Assert
    expect(accepted).toBe(true);
  });

  it('rejects CSS whose faces are generated kit files', () => {
    expect(isStaticGoogleFontsCss(KIT_FACE)).toBe(false);
  });

  it('rejects CSS that mixes static and generated faces', () => {
    expect(isStaticGoogleFontsCss(`${STATIC_FACE}\n${KIT_FACE}`)).toBe(false);
  });

  it('rejects a body with no font URL at all', () => {
    expect(isStaticGoogleFontsCss('<html>rate limited</html>')).toBe(false);
  });

  it('reads quoted URLs the same as bare ones', () => {
    const quoted = 'src: url(\'https://fonts.gstatic.com/s/manrope/v23/static-face.woff2\') format(\'woff2\');';

    expect(isStaticGoogleFontsCss(quoted)).toBe(true);
  });
});

describe('firstAcceptedAnswer', () => {
  it('skips rejected answers and returns the first accepted one', async () => {
    // Arrange
    const fetcher = scripted([
      { ok: true, body: KIT_FACE },
      { ok: true, body: KIT_FACE },
      { ok: true, body: STATIC_FACE },
    ]);

    // Act
    const answer = await firstAcceptedAnswer(fetcher.fetchOnce, isStaticAnswer, 5);

    // Assert
    expect(answer?.body).toBe(STATIC_FACE);
    expect(fetcher.calls()).toBe(3);
  });

  it('skips a failed response even when its body looks static', async () => {
    const fetcher = scripted([
      { ok: false, body: STATIC_FACE },
      { ok: true, body: STATIC_FACE },
    ]);

    const answer = await firstAcceptedAnswer(fetcher.fetchOnce, isStaticAnswer, 5);

    expect(answer?.ok).toBe(true);
    expect(fetcher.calls()).toBe(2);
  });

  it('counts a thrown fetch as a failed attempt, reports it and keeps going', async () => {
    // Arrange
    let calls = 0;
    const reported: string[] = [];
    const fetchOnce = async (): Promise<Answer> => {
      calls += 1;
      if (calls === 1) throw new Error('net::ERR_NAME_NOT_RESOLVED');
      return { ok: true, body: STATIC_FACE };
    };

    // Act
    const answer = await firstAcceptedAnswer(fetchOnce, isStaticAnswer, 5, (error) => {
      reported.push(String(error));
    });

    // Assert
    expect(answer?.body).toBe(STATIC_FACE);
    expect(calls).toBe(2);
    expect(reported).toEqual(['Error: net::ERR_NAME_NOT_RESOLVED']);
  });

  it('returns undefined when every attempt throws', async () => {
    let calls = 0;
    const fetchOnce = async (): Promise<Answer> => {
      calls += 1;
      throw new Error('Timeout 5000ms exceeded');
    };

    const answer = await firstAcceptedAnswer(fetchOnce, isStaticAnswer, 3);

    expect(answer).toBeUndefined();
    expect(calls).toBe(3);
  });

  it('gives up after the attempt limit and returns undefined', async () => {
    const fetcher = scripted([{ ok: true, body: KIT_FACE }]);

    const answer = await firstAcceptedAnswer(fetcher.fetchOnce, isStaticAnswer, 4);

    expect(answer).toBeUndefined();
    expect(fetcher.calls()).toBe(4);
  });
});

describe('the font cache', () => {
  const URL_A = 'https://fonts.gstatic.com/s/manrope/v23/face-a.woff2';
  const URL_B = 'https://fonts.gstatic.com/s/manrope/v23/face-b.woff2';

  it('returns what was written for the same URL', () => {
    // Arrange
    const dir = freshCacheDir();
    const body = Buffer.from([0x77, 0x4f, 0x46, 0x32, 0x00, 0xff]);

    // Act
    writeCachedResponse(dir, URL_A, { contentType: 'font/woff2', body });
    const cached = readCachedResponse(dir, URL_A);

    // Assert
    expect(cached?.contentType).toBe('font/woff2');
    expect(cached?.body.equals(body)).toBe(true);
  });

  it('answers undefined for a URL it never stored', () => {
    const dir = freshCacheDir();
    writeCachedResponse(dir, URL_A, { contentType: 'font/woff2', body: Buffer.from('a') });

    expect(readCachedResponse(dir, URL_B)).toBeUndefined();
  });

  it('answers undefined before the directory exists', () => {
    const dir = freshCacheDir();

    expect(existsSync(dir)).toBe(false);
    expect(readCachedResponse(dir, URL_A)).toBeUndefined();
  });

  it('treats a corrupt entry as a miss', () => {
    // Arrange
    const dir = freshCacheDir();
    writeCachedResponse(dir, URL_A, { contentType: 'font/woff2', body: Buffer.from('a') });
    const [entry] = readdirSync(dir);
    writeFileSync(join(dir, entry ?? ''), '{"url": "trunc');

    // Act
    const cached = readCachedResponse(dir, URL_A);

    // Assert
    expect(cached).toBeUndefined();
  });

  it('leaves no temporary file behind after a write', () => {
    const dir = freshCacheDir();

    writeCachedResponse(dir, URL_A, { contentType: 'text/css', body: Buffer.from(STATIC_FACE) });

    expect(readdirSync(dir).filter((name) => name.includes('.tmp'))).toEqual([]);
    expect(readdirSync(dir)).toHaveLength(1);
  });
});

const FONT_URL_A = 'https://fonts.gstatic.com/s/manrope/v23/face-a.woff2';
const WOFF2 = Buffer.from([0x77, 0x4f, 0x46, 0x32]);

interface FakeAnswer {
  ok: boolean;
  contentType: string;
  body: Buffer;
}

/**
 * A stand-in for Playwright's Route: hands out scripted network answers
 * (an Error entry throws) and records how the request was settled.
 */
function fakeRoute(url: string, answers: Array<FakeAnswer | Error>) {
  const settled: Array<{ kind: 'fulfill'; body: Buffer; contentType: string } | { kind: 'abort' }> = [];
  let fetches = 0;
  const route = {
    request: () => ({ url: () => url }),
    fetch: async () => {
      const answer = answers[Math.min(fetches, answers.length - 1)];
      fetches += 1;
      if (answer === undefined) throw new Error('fake route has no answers');
      if (answer instanceof Error) throw answer;
      return {
        ok: () => answer.ok,
        headers: () => ({ 'content-type': answer.contentType }),
        body: async () => answer.body,
      };
    },
    fulfill: async (options: { body: Buffer; contentType: string }) => {
      settled.push({ kind: 'fulfill', body: options.body, contentType: options.contentType });
    },
    abort: async () => {
      settled.push({ kind: 'abort' });
    },
  };
  return { route, settled, fetches: () => fetches };
}

const acceptFont = (answer: FakeAnswer) => answer.ok && answer.contentType.startsWith('font/');

describe('answerFromCache', () => {
  it('answers a cached URL without fetching', async () => {
    // Arrange
    const dir = freshCacheDir();
    writeCachedResponse(dir, FONT_URL_A, { contentType: 'font/woff2', body: WOFF2 });
    const fake = fakeRoute(FONT_URL_A, [new Error('network must not be used')]);

    // Act
    await answerFromCache(fake.route, acceptFont, dir);

    // Assert
    expect(fake.fetches()).toBe(0);
    expect(fake.settled).toEqual([{ kind: 'fulfill', body: WOFF2, contentType: 'font/woff2' }]);
  });

  it('fetches a miss, stores it and fulfils with it', async () => {
    const dir = freshCacheDir();
    const fake = fakeRoute(FONT_URL_A, [{ ok: true, contentType: 'font/woff2', body: WOFF2 }]);

    await answerFromCache(fake.route, acceptFont, dir);

    expect(fake.settled).toEqual([{ kind: 'fulfill', body: WOFF2, contentType: 'font/woff2' }]);
    expect(readCachedResponse(dir, FONT_URL_A)?.body.equals(WOFF2)).toBe(true);
  });

  it('aborts and stores nothing when no answer is accepted', async () => {
    const dir = freshCacheDir();
    const fake = fakeRoute(FONT_URL_A, [{ ok: true, contentType: 'text/html', body: Buffer.from('<html>') }]);

    await answerFromCache(fake.route, acceptFont, dir, 3);

    expect(fake.fetches()).toBe(3);
    expect(fake.settled).toEqual([{ kind: 'abort' }]);
    expect(readCachedResponse(dir, FONT_URL_A)).toBeUndefined();
  });

  it('still fulfils when the cache cannot be written', async () => {
    // Arrange: a plain file where the cache directory should be
    const parent = mkdtempSync(join(tmpdir(), 'visual-fonts-'));
    const dir = join(parent, 'cache');
    writeFileSync(dir, 'not a directory');
    const fake = fakeRoute(FONT_URL_A, [{ ok: true, contentType: 'font/woff2', body: WOFF2 }]);

    // Act
    await answerFromCache(fake.route, acceptFont, dir);

    // Assert
    expect(fake.settled).toEqual([{ kind: 'fulfill', body: WOFF2, contentType: 'font/woff2' }]);
  });

  it('refetches over a corrupt entry', async () => {
    const dir = freshCacheDir();
    writeCachedResponse(dir, FONT_URL_A, { contentType: 'font/woff2', body: Buffer.from('old') });
    const [entry] = readdirSync(dir);
    writeFileSync(join(dir, entry ?? ''), '');
    mkdirSync(dir, { recursive: true });
    const fake = fakeRoute(FONT_URL_A, [{ ok: true, contentType: 'font/woff2', body: WOFF2 }]);

    await answerFromCache(fake.route, acceptFont, dir);

    expect(fake.fetches()).toBe(1);
    expect(fake.settled).toEqual([{ kind: 'fulfill', body: WOFF2, contentType: 'font/woff2' }]);
  });
});
