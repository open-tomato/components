import { describe, expect, it } from 'bun:test';
import { cva, type VariantProps } from 'class-variance-authority';

import { extendVariants, type VariantsConfig } from './extendVariants';

/** True when A and B are the same type, optional modifiers included. */
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;

const pressableConfig = {
  base: 'relative cursor-pointer',
  variants: {
    inline: { false: 'flex', true: 'inline-flex' },
    rounded: { none: 'rounded-none', md: 'rounded-md', full: 'rounded-full' },
    tone: { plain: 'text-fg1', loud: 'text-danger' },
  },
  defaultVariants: { inline: false, rounded: 'md', tone: 'plain' },
  compoundVariants: [{ inline: true, rounded: 'full', class: 'px-3' }],
} satisfies VariantsConfig<{
  inline: { false: string; true: string };
  rounded: { none: string; md: string; full: string };
  tone: { plain: string; loud: string };
}>;

const chip = extendVariants(pressableConfig, {
  base: 'gap-1 text-sm',
  variants: {
    size: { sm: 'h-6', md: 'h-8' },
    tone: { quiet: 'text-fg3', accent: 'text-accent' },
  },
  defaultVariants: { size: 'sm', tone: 'quiet', rounded: 'full' },
  compoundVariants: [
    { size: 'md', inline: true, class: 'pl-2' },
    { tone: 'accent', rounded: 'full', class: 'ring-1' },
  ],
});

type ChipVariants = VariantProps<typeof chip>;

/* Type tests: checked by `bun run check-types`, which covers test files. */
type _UnionOfBothSets = Assert<Equal<ChipVariants, {
  inline?: boolean | null | undefined;
  rounded?: 'none' | 'md' | 'full' | null | undefined;
  size?: 'sm' | 'md' | null | undefined;
  tone?: 'quiet' | 'accent' | null | undefined;
}>>;
type _BaseOnlyExtension = Assert<Equal<
  VariantProps<ReturnType<typeof extendVariants<typeof pressableConfig.variants>>>,
  {
    inline?: boolean | null | undefined;
    rounded?: 'none' | 'md' | 'full' | null | undefined;
    tone?: 'plain' | 'loud' | null | undefined;
  }
>>;

describe('extendVariants types', () => {
  it('refuses what cva would refuse', () => {
    // @ts-expect-error -- 'loud' belongs to the base's `tone`, which the extension replaced.
    chip({ tone: 'loud' });
    // @ts-expect-error -- no variant is called `elevated`.
    chip({ elevated: true });
    // @ts-expect-error -- cva's ClassProp: `class` and `className` are exclusive.
    chip({ class: 'a', className: 'b' });

    extendVariants(pressableConfig, {
      variants: { size: { sm: 'h-6' } },
      // @ts-expect-error -- a default must name an option of the merged set.
      defaultVariants: { rounded: 'huge' },
    });
    extendVariants(pressableConfig, {
      variants: { size: { sm: 'h-6' } },
      // @ts-expect-error -- a compound must name options of the merged set.
      compoundVariants: [{ size: 'xl', class: 'p-1' }],
    });
    expect(true).toBe(true);
  });
});

describe('extendVariants', () => {
  it('puts the base blueprint first and the extension after it', () => {
    expect(chip()).toBe('relative cursor-pointer flex rounded-full gap-1 text-sm h-6 text-fg3');
  });

  it('resolves base and own variants from the same props object', () => {
    expect(chip({ inline: true, size: 'md' }))
      .toBe('relative cursor-pointer inline-flex rounded-full px-3 gap-1 text-sm h-8 text-fg3 pl-2');
  });

  it('replaces the base variant on a key clash, options included', () => {
    const classes = chip({ tone: 'accent' }).split(' ');
    expect(classes).toContain('text-accent');
    expect(classes).not.toContain('text-fg1');
    expect(classes).not.toContain('text-danger');
  });

  it('uses the extension\'s default over the base\'s for the same key', () => {
    expect(chip().split(' ')).toContain('rounded-full');
    expect(chip().split(' ')).not.toContain('rounded-md');
  });

  it('keeps the base\'s default for a key the extension leaves alone', () => {
    const plain = extendVariants(pressableConfig, { base: 'p-1' });
    expect(plain()).toBe(cva(pressableConfig.base, pressableConfig)({ className: 'p-1' }));
  });

  it('drops a variant passed as null, the way cva does', () => {
    expect(chip({ rounded: null, size: null })).toBe('relative cursor-pointer flex gap-1 text-sm text-fg3');
  });

  it('matches compounds against the resolved props, defaults of both sets included', () => {
    expect(chip({ tone: 'accent' }).split(' ')).toContain('ring-1');
    expect(chip({ tone: 'accent', rounded: 'md' }).split(' ')).not.toContain('ring-1');
  });

  it('lets the later class win through cn: own base over base variants, call site last', () => {
    const block = extendVariants(pressableConfig, { base: 'inline-flex' });
    expect(block()).toBe('relative cursor-pointer rounded-md text-fg1 inline-flex');
    expect(block({ class: 'rounded-none' })).toBe('relative cursor-pointer text-fg1 inline-flex rounded-none');
    expect(block({ className: 'text-danger' })).toBe('relative cursor-pointer rounded-md inline-flex text-danger');
  });

  it('extends a base that has no variants', () => {
    const ring = extendVariants({ base: 'ring-2' }, { variants: { on: { true: 'ring-leaf', false: '' } } });
    expect(ring({ on: true })).toBe('ring-2 ring-leaf');
    expect(ring()).toBe('ring-2');
  });

  it('reads an undefined default in the extension as unset, keeping the base\'s', () => {
    const quiet = extendVariants(pressableConfig, { defaultVariants: { tone: undefined } });
    expect(quiet().split(' ')).toContain('text-fg1');
  });

  it('falls back to the default for an empty-string prop, the way cva does', () => {
    const plain = extendVariants(pressableConfig);
    const empty = { rounded: '' as 'md' };
    expect(plain(empty)).toBe(cva(pressableConfig.base, pressableConfig)(empty));
  });

  it('drops the base compounds that name a replaced key', () => {
    const sized = extendVariants(
      { variants: { size: { sm: 'h-6' } }, compoundVariants: [{ size: 'sm', class: 'base-compound' }] },
      { variants: { size: { sm: 'h-5', lg: 'h-9' } }, defaultVariants: { size: 'sm' } },
    );
    expect(sized()).toBe('h-5');
  });

  it('leaves the configs it was given untouched', () => {
    const before = JSON.stringify(pressableConfig);
    chip({ tone: 'accent', inline: true });
    expect(JSON.stringify(pressableConfig)).toBe(before);
  });
});
