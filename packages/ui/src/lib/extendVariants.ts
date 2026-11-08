import type { ClassProp, ClassValue, StringToBoolean } from 'class-variance-authority/types';

import { cva } from 'class-variance-authority';

import { cn } from './cn';

/** A cva variant schema: variant name, then option name, then its classes. */
export type VariantSchema = Record<string, Record<string, ClassValue>>;

/** One chosen option per variant, the shape cva's props and `defaultVariants` take. */
export type VariantSelection<T extends VariantSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};

/** A compound condition: each variant may also list several options. */
type CompoundSelection<T extends VariantSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | StringToBoolean<keyof T[Variant]>[] | undefined;
};

/**
 * The cva config as one object, `base` included: what a blueprint in
 * `src/particles` exports next to its cva function, because cva 0.7.1 does
 * not expose a function's config.
 */
export interface VariantsConfig<T extends VariantSchema> {
  base?: ClassValue;
  variants?: T;
  defaultVariants?: VariantSelection<T>;
  compoundVariants?: (CompoundSelection<T> & ClassProp)[];
}

/** The base's variants with the extension's laid over them: on a key clash the extension's wins. */
export type MergedSchema<B extends VariantSchema, E extends VariantSchema> = Omit<B, keyof E> & E;

/** A variants function with cva's call signature, so `VariantProps<typeof fn>` reads it. */
export type VariantsFunction<T extends VariantSchema> = (props?: VariantSelection<T> & ClassProp) => string;

/**
 * What an extension takes: cva's config shape, where `defaultVariants` and
 * `compoundVariants` may name the base's variants too.
 */
export interface ExtensionConfig<B extends VariantSchema, E extends VariantSchema> {
  base?: ClassValue;
  variants?: E;
  defaultVariants?: NoInfer<VariantSelection<MergedSchema<B, E>>>;
  compoundVariants?: NoInfer<(CompoundSelection<MergedSchema<B, E>> & ClassProp)[]>;
}

type Selection = Record<string, unknown>;

/**
 * cva with its generic types dropped, for the plumbing inside
 * `extendVariants`: the schemas are checked at its signature, and cva's own
 * `Config<T>` cannot hold a schema that is still a type parameter.
 */
const plainCva = cva as unknown as (
  base: ClassValue,
  config: { variants: VariantSchema; compoundVariants?: readonly object[] },
) => (props: Selection) => string;

/** A copy of `record` without the keys in `drop`. */
function without<T>(record: Record<string, T> | undefined, drop: ReadonlySet<string>): Record<string, T> {
  return Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => !drop.has(key)));
}

/**
 * A copy of `record` without the keys left unset: `undefined`, and `''`,
 * which cva also answers with the default.
 */
function chosenOnly(record: Selection | undefined): Selection {
  return Object.fromEntries(Object.entries(record ?? {}).filter(([, value]) => value !== undefined && value !== ''));
}

/** True when a compound's condition names one of the `keys`. */
function namesAny(compound: object, keys: ReadonlySet<string>): boolean {
  return Object.keys(compound).some((key) => keys.has(key));
}

/**
 * Extends a variants blueprint with a component's own variants, keeping
 * cva's syntax, types and semantics: `config` is the shape `cva()` takes,
 * and the result has cva's call signature over both variant sets.
 *
 * The classes are `cn(base(props), own(props), class)`, so the extension's
 * classes come after the blueprint's and win a tailwind conflict, and the
 * call site's `class` or `className` comes last. When a variant key is in
 * both sets, the extension's options replace the base's for that key, like
 * tailwind-variants' `extend`; the same goes for `defaultVariants`, and
 * the base's compounds that name that key are dropped with its options.
 * The other compounds of both sets match against the props resolved with
 * both sets' defaults.
 *
 *   const chipVariants = extendVariants(touchableConfig, {
 *     base: 'gap-1 text-sm',
 *     variants: { size: { sm: 'h-6', md: 'h-8' } },
 *     defaultVariants: { size: 'sm', rounded: 'full' },
 *   });
 */
export function extendVariants<
  B extends VariantSchema = Record<never, never>,
  E extends VariantSchema = Record<never, never>,
>(
  baseConfig: VariantsConfig<B>,
  config: ExtensionConfig<B, E> = {},
): VariantsFunction<MergedSchema<B, E>> {
  const replaced = new Set(Object.keys(config.variants ?? {}));
  const defaults = {
    ...without(chosenOnly(baseConfig.defaultVariants), replaced),
    ...chosenOnly(config.defaultVariants),
  };
  // Defaults are resolved here, so the inner cva functions take none of their own.
  const base = plainCva(baseConfig.base, {
    variants: without(baseConfig.variants, replaced),
    compoundVariants: baseConfig.compoundVariants?.filter((compound) => !namesAny(compound, replaced)),
  });
  const own = plainCva(config.base, {
    variants: config.variants ?? {},
    compoundVariants: config.compoundVariants,
  });

  return (props) => {
    const { class: classProp, className, ...chosen } = props ?? {};
    const resolved = { ...defaults, ...chosenOnly(chosen) };
    return cn(base(resolved), own(resolved), classProp, className);
  };
}
