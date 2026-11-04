/**
 * The privacy rules: what a tracked file may not carry in a public
 * repository. Each rule reads one string and answers findings with a
 * line number, so the same rules judge a staged blob, a tracked file and
 * every blob in the history.
 *
 * Three families:
 *
 * - **Banned terms**, stored as sha256 hashes of their lowercase form so
 *   this file never spells them: machine names, the private domain,
 *   private repositories, the maintainer's home path and mail handle.
 * - **Shapes**, which need no list: a home directory path, a private or
 *   public IPv4 address, a LAN host name, a credential prefix.
 * - **Sample data**, the gap other projects found: mock people in
 *   stories, fixtures and tests. There an email, a URL, a phone number
 *   or a profile link must use a reserved example domain or number, so a
 *   real person's address can never pass as a sample.
 *
 * To ban a term, print its hash and add a line to `BANNED` with a label
 * that does not spell it:
 *
 *   bun -e 'console.log(new Bun.CryptoHasher("sha256").update(process.argv[1].toLowerCase()).digest("hex"))' '<term>'
 */

/** A rule's answer: the line it fired on and what it found. */
export interface Finding {
  readonly line: number;
  readonly rule: RuleName;
  /** What matched. A banned term is shown by its label only. */
  readonly evidence: string;
}

/** The rule names, as the report and the allowlist spell them. */
export type RuleName =
  | 'banned-term'
  | 'home-path'
  | 'ip-address'
  | 'lan-host'
  | 'credential'
  | 'email'
  | 'sample-url'
  | 'sample-phone'
  | 'profile-link';

/** sha256 of each banned lowercase term, with a label that does not spell it. */
export const BANNED: ReadonlyMap<string, string> = new Map([
  ['7d445240c97cb8b39b22030981d77679608f91c7a4000e41a1794cde953a1846', 'a private machine name (1)'],
  ['77f1d1c04d32a84a569b4aed05ef453ec4f464fcac98de97bb2f5033df2c4a04', 'a private machine name (2)'],
  ['982945308d3682d16636fd628c314e293499e99c00120acd9b693f5ab16e1648', 'a private machine name (3)'],
  ['831ce4a48d424b3b8d752655a4451e1669262c24c47cb90ea5ec90d1e7d56312', 'a private machine name (4)'],
  ['52f3141f5cb06025c96c6794e35f5611a578919d0deb4d934136acaba06d4b82', 'a private machine name (5)'],
  ['4bc7c278e449fa5530bad133774f806ddcfba35b8a43b327e5345822831dfff5', 'a private machine name (6)'],
  ['a60755a3b272981e54482bedfa9f443288912829bd65eabf75f899a25dc32bf2', 'a private disk name'],
  ['4230793e75a9fa85f545ae072cf77eace73d3c27247dada0a3e418e7dcba10d7', 'the private domain word'],
  ['83ad19e0d265a97b2d61e77a68ea8a9168fb6a5fc9301fca4deb447b37c6ee29', 'the private domain'],
  ['406369d8caab5757e24e4aa1d0b7e21d2f5de9d5e728764c676b54d1996780a0', 'the maintainer\'s personal mail handle'],
  ['3e55007b27d65a0fbaa4843c40842f60e47aeb882a55c3e076c61e4fd3c4c96a', 'the maintainer\'s home path (macOS)'],
  ['67eed59cf4f9c9c73f23fd8afa6b3abd6984a6f461a567ceff34cca0ea8b8f91', 'the maintainer\'s home path (Linux)'],
  ['174a9fc08b0122f393c8eae63583efc39d646a7575b5126e5cbaf9a789788432', 'a private repository (1)'],
  ['8fd92190dd20034fd950b51363a4603a0631cd7f9c0751a62de217b6d2f1dc60', 'a private repository (2)'],
  ['7c239ce23c100870ee8a79f1b0f1f61e3f1157b947e7b4f64c2894121d0db3b9', 'a private repository (3)'],
  ['e1395868b87dec977d4ff43535a248056f8733b2c43df483a1d698ff32076947', 'a private repository (4)'],
  ['9fdd8ade8a4a784b5cc162dcf0ee925a5642e35cb5f9e6271d9b3a991edf6024', 'a private repository (5)'],
]);

/** Characters a token is made of, for the banned-term rule. */
const TOKEN = /[a-z0-9._/~@-]+/g;

/** The separators that split a token into words. */
const SEPARATOR = /[._/~@-]/;

/** Tokens longer than this are cut into words from their first part only. */
const MAX_WORDS = 24;

/** Mail and web domains reserved for examples (RFC 2606, RFC 6761). */
const RESERVED_DOMAIN = /(^|\.)(example\.(com|net|org)|example|test|invalid|localhost)$/;

/** IPv4 addresses kept for documentation, loopback and wildcards. */
const ALLOWED_IP = /^(127\.0\.0\.1|0\.0\.0\.0|255\.255\.255\.255|192\.0\.2\.\d+|198\.51\.100\.\d+|203\.0\.113\.\d+)$/;

/** Hosts a sample may link to without naming anyone. */
const ALLOWED_SAMPLE_HOST = /(^|\.)(example\.(com|net|org)|example|test|invalid|localhost|www\.w3\.org|w3\.org)$/;

/** Credential prefixes a vendor issues keys under, followed by a key-like body. */
const CREDENTIAL = /\b(gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|(AKIA|ASIA)[A-Z0-9]{16}|sk-(ant-)?[A-Za-z0-9_-]{20,}|xox[abprs]-[A-Za-z0-9-]{10,}|AIza[A-Za-z0-9_-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;

/** A home directory with its account segment, on macOS, Linux or Windows. */
const HOME_PATH = /(^|[^\w.-])(\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+|[A-Za-z]:\\Users\\[A-Za-z0-9._-]+)/;

/** A dotted quad, checked for range after the match. */
const IPV4 = /(?<![\w.])(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?![\w.]*\d)/g;

/** An SVG path or points attribute, whose numbers read like dotted quads. */
const SVG_PATH = /(^|\s)(d|points)=["{]/;

/** A host name on a LAN-only suffix. */
const LAN_HOST = /\b[a-z0-9-]+\.(local|lan|internal|home\.arpa|localdomain)\b/i;

/** An email address; the domain is checked after the match. */
const EMAIL = /(?<![\w/@.-])[A-Za-z0-9._%+-]+@((?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,})(?![\w-])/g;

/** An http(s) URL's host. */
const URL_HOST = /https?:\/\/([A-Za-z0-9.-]+)/g;

/** A phone number shape: optional country code, then 9 to 13 digits in groups. */
const PHONE = /(?<![\w.])\+?\d{1,3}?[ (.-]*\d{2,4}[ ).-]+\d{3,4}[ .-]+\d{3,4}(?![\w.])/g;

/** The fictional range: 555-0100 to 555-0199. */
const FICTIONAL_PHONE = /555[ .-]?01\d\d/;

/** A link to a person's profile on a public network. */
const PROFILE = /\b(github\.com|gitlab\.com|twitter\.com|x\.com|linkedin\.com\/in|instagram\.com|facebook\.com)\/([A-Za-z0-9_.-]+)/gi;

/** Paths that hold sample data: stories, fixtures, mocks, tests. */
const SAMPLE_PATH = /(\.stories\.[jt]sx?$|\.test\.[jt]sx?$|\.spec\.[jt]sx?$|(^|\/)(stories|fixtures?|mocks?|__mocks__|testdata|samples?)\/|fixtures?\.[jt]sx?$|mocks?\.[jt]sx?$)/;

/** Whether `path` holds sample data. */
export function isSamplePath(path: string): boolean {
  return SAMPLE_PATH.test(path);
}

/** The sha256 of `text`, as hex. */
export function sha256(text: string): string {
  return new Bun.CryptoHasher('sha256').update(text)
    .digest('hex');
}

/** Every run of whole words in `token`, each with and without the separator before it. */
function candidates(token: string): string[] {
  const words: { start: number; end: number }[] = [];
  let start = -1;
  for (let index = 0; index <= token.length; index += 1) {
    const isWord = index < token.length && !SEPARATOR.test(token.charAt(index));
    if (isWord && start === -1) start = index;
    if (!isWord && start !== -1) {
      words.push({ start, end: index });
      start = -1;
    }
  }
  const runs: string[] = [];
  const kept = words.slice(0, MAX_WORDS);
  for (let first = 0; first < kept.length; first += 1) {
    const from = kept[first]?.start ?? 0;
    for (let last = first; last < kept.length; last += 1) {
      const to = kept[last]?.end ?? 0;
      runs.push(token.slice(from, to));
      if (from > 0) runs.push(token.slice(from - 1, to));
    }
  }
  return runs;
}

/** The labels of the banned terms one line holds. */
export function bannedIn(text: string, banned: ReadonlyMap<string, string> = BANNED): string[] {
  const found = new Set<string>();
  for (const token of text.toLowerCase().match(TOKEN) ?? []) {
    for (const candidate of candidates(token)) {
      const label = banned.get(sha256(candidate));
      if (label !== undefined) found.add(label);
    }
  }
  return [...found];
}

/** Whether an IPv4 match is a real address outside the allowed set. */
function isReportableIp(parts: string[], text: string): boolean {
  if (parts.some((part) => Number(part) > 255)) return false;
  return !ALLOWED_IP.test(text);
}

/** The findings of the rules that apply to every file, for one line. */
function lineFindings(text: string, line: number, banned: ReadonlyMap<string, string>): Finding[] {
  const findings: Finding[] = [];
  for (const label of bannedIn(text, banned)) findings.push({ line, rule: 'banned-term', evidence: label });
  const home = HOME_PATH.exec(text);
  if (home?.[2] !== undefined) findings.push({ line, rule: 'home-path', evidence: home[2] });
  const svgPath = SVG_PATH.test(text);
  for (const match of svgPath
    ? []
    : text.matchAll(IPV4)) {
    if (isReportableIp(match.slice(1, 5), match[0])) findings.push({ line, rule: 'ip-address', evidence: match[0] });
  }
  const lan = LAN_HOST.exec(text);
  if (lan !== null) findings.push({ line, rule: 'lan-host', evidence: lan[0] });
  const credential = CREDENTIAL.exec(text);
  if (credential?.[1] !== undefined) findings.push({ line, rule: 'credential', evidence: `${credential[1].slice(0, 6)}…` });
  for (const match of text.matchAll(EMAIL)) {
    const domain = (match[1] ?? '').toLowerCase();
    if (!RESERVED_DOMAIN.test(domain)) findings.push({ line, rule: 'email', evidence: match[0] });
  }
  return findings;
}

/** The findings of the sample-data rules, for one line of a sample file. */
function sampleFindings(text: string, line: number): Finding[] {
  const findings: Finding[] = [];
  for (const match of text.matchAll(URL_HOST)) {
    const host = (match[1] ?? '').toLowerCase();
    if (!ALLOWED_SAMPLE_HOST.test(host)) findings.push({ line, rule: 'sample-url', evidence: match[0] });
  }
  for (const match of text.matchAll(PHONE)) {
    const digits = match[0].replace(/\D/g, '');
    if (digits.length >= 9 && !FICTIONAL_PHONE.test(match[0])) findings.push({ line, rule: 'sample-phone', evidence: match[0].trim() });
  }
  for (const match of text.matchAll(PROFILE)) findings.push({ line, rule: 'profile-link', evidence: match[0] });
  return findings;
}

/** Every finding in one file's text. Line numbers count from one. */
export function scan(path: string, text: string, banned: ReadonlyMap<string, string> = BANNED): Finding[] {
  const sample = isSamplePath(path);
  const findings: Finding[] = [];
  text.split('\n').forEach((content, index) => {
    findings.push(...lineFindings(content, index + 1, banned));
    if (sample) findings.push(...sampleFindings(content, index + 1));
  });
  return findings;
}
