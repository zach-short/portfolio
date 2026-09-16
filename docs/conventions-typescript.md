<!-- personal-config v0.1.0 · 2026-09-15 · config 8b28a65e · standard v1.0.2 -->
# TypeScript conventions

The standard for TypeScript in this repo. **Self-contained** — apply it without reading
anything else.

Every rule has an ID, and IDs are never renumbered — they are how commit messages and other
docs cite a rule. Every rule carries an enforcement tag: *gate* (`bun run build` or
`bunx tsc --noEmit` catches it) · *review* (nothing catches it — it rots without discipline).
The tag tells you whether a clean run means anything. The *lint* and *CI* tags the boilerplate
offers are cut here, matching `docs/AGENT-PRACTICES.md` §8.1: verified 2026-09-15, this repo
has no ESLint config, no `eslint` dependency and no CI, so neither tag could ever be honest.

Provenance labels mark which rules are choices: *[STANDARD]* canonical for the ecosystem ·
*[COMMON]* widespread, alternatives exist · *[OURS]* a house preference, justified on its
own terms. This is what stops a later agent "correcting" a deliberate call.

Where a formatter or linter would settle something — quotes, semicolons, import order — the
config would be the rule and this file would say nothing. **Verified 2026-09-15: no formatter
and no linter is configured in this repo.** Nothing below is enforced by tooling; every rule
here is *review*, and a green gate says nothing about any of them.

> **Seeded by `personal-config` from your answers.** Every correct/incorrect pair below is
> illustrative until someone replaces it with real code from this repo — the standard asks
> for real pairs, and a seeded one is a placeholder that happens to compile.
>
> Every rule is seeded *review* for the same reason: a tag is a claim about tooling, and
> nothing here has configured anything that catches these. Promote a rule to *gate* yourself
> once something does.
>
> **Existing exceptions, found 2026-09-15 by the adapt protocol and left alone** — they are
> Zach's to decide, not a passing session's to fix:
>
> - **T1** is violated at `app/blog/leetcode/[slug]/page.tsx:58`, `:91` and `:103`, all
>   `{ post }: { post: any }`. There is no `Post` type in the repo; the post shape lives only
>   in `content/template.tsx`. A green `bunx tsc --noEmit` does not object, which is the point
>   of the *review* tag.
> - **E1** — the 61 `content/leetcode/*.tsx` files each `export default` their post object
>   because that is the loader's contract (`utils/get-leetcode-posts.ts:15` reads `.default`).
>   That is a deliberate house pattern, not drift. `components/back-arrow-button.tsx` and
>   `app/blog/components/problem-link.tsx` default-export without a framework reason, and are
>   real E1 exceptions.
> - **F1** — `app/lib/getLeetcodePosts.ts` is camelCase. It is also dead: nothing imports it
>   (grep over `app components content utils`, 2026-09-15).
> - **I1** is clean: no `../` import anywhere in `app components utils content`, 2026-09-15.

## C1 — Comments say why, never what

*review* · **[OURS]**

A comment restating the line below it is banned — rename or extract instead. A comment recording *why* is required where the reason is not derivable from the code. **Never bulk-delete comments**, and never strip one in a protected category: product or design rationale, a lint-suppression justification, an external-constraint workaround, or documentation on a public export.

```
// right: // the vendor API 404s on an empty cart, so we send one dummy line
// wrong: // loop over the items
```

## L1 — Functions stay short — roughly 6–15 lines

*review* · **[OURS]**

A function that fits on a screen is reviewed at a glance and tested alone. Extract for a *concept*, not to relocate lines: a helper that needs three parameters to explain itself was the wrong cut. Markup and view bodies are exempt from the count.

```
// right: function priceWithTax(order) { return applyTax(subtotal(order), order.region); }
// wrong: function priceWithTax(order) { /* 40 lines of inlined subtotal and tax */ }
```

## E1 — Named exports everywhere; exported things are declarations

*review* · **[COMMON]**

Default exports only where the framework requires them (a route file, an entry point). Anything exported is a `function` declaration rather than a `const` arrow, so it hoists, names itself in a stack trace, and is greppable.

```
// right: export function formatMoney(cents: number): string { … }
// wrong: export default (cents: number) => { … }
```

## F1 — Filenames are kebab-case

*review* · **[COMMON]**

Acronyms are words, not shouts: `userId`, `apiUrl`, `HttpClient` — except in Go, where initialisms keep uniform case (`userID`, `apiURL`, `HTTPClient`). Where two standards disagree on this, the file extension decides which applies, and both say so.

```
// right: src/user-profile/address-book.ts
// wrong: src/UserProfile/AddressBook.ts
```

## I1 — No parent-relative imports; groups separated by a blank line

*review* · **[COMMON]**

`./sibling` is fine; anything containing `../` is not — use the path alias. A `../` chain encodes the current file’s position in the tree, so moving the file breaks an import that had nothing to do with the move. Groups: standard library, third party, internal aliases, then relative.

```
// right: import { formatMoney } from '@/lib/money';
// wrong: import { formatMoney } from '../../../lib/money';
```

## T1 — The type layer has no silent escape hatches

*review* · **[OURS]**

`strict` in one base config, extended by everything. Banned: `any`, `unknown` in props, and `as unknown as`. Prefer string-literal unions to `enum` — an enum is a runtime value pretending to be a type.

```
// right: type Status = 'open' | 'held' | 'done';
// wrong: enum Status { Open, Held, Done }
```

## L2 — Logic is extracted by concept

*review* · **[OURS]**

Extract to a hook when a component has more than two `useState`, any `useEffect` with real work, or logic another component would want. One hook per file, named for the hook. Extract for a *concept*, not to relocate lines.

```
// right: const { frame, capture } = useMarketCamera();
// wrong: const [a, setA] = useState(); const [b, setB] = useState(); useEffect(() => { /* 30 lines */ });
```

## D1 — One typed client; raw calls are banned in app code

*review* · **[OURS]**

Every network and database call goes through one typed client; a bare `fetch` or a raw driver call in app code fails review, because the client is the one place retries, auth, error shape and types are decided. Environment variables are read and validated once at startup and passed down — never read inline in app code, where a missing value surfaces as a runtime undefined three layers away from the cause.

```
// right: const listing = await api.listings.get(id);
// wrong: await fetch(`/api/listings/${id}`).then((r) => r.json())
```

## D2 — Loading, error and empty states are mandatory

*review* · **[OURS]**

All three render through one shared component, so a screen cannot ship with two of them. The empty state is the one that gets skipped, and it is the one a new user sees first.

```
// right: <DataState query={q} empty={<NoListings />}>{(rows) => …}</DataState>
// wrong: if (isLoading) return <Spinner />;  // and nothing for error or empty
```

## S1 — Design tokens, never literals

*review* · **[OURS]**

Role-named tokens with one swap point per platform, so a redesign is one edit rather than a repo-wide find-and-replace. Every platform in the repo defaults to the OS colour scheme; a colour that cannot resolve per scheme is not a token.

```
// right: className="bg-surface border-line"
// wrong: className="bg-[#F7F3E8] border-[#D9CDB4]"
```

## X1 — Pure logic gets tests, in a new file named for the feature

*review* · **[COMMON]**

A new file rather than an addition to an existing suite, so two sessions working in parallel do not collide in one file. Write characterization tests *before* moving logic, not after — a test written after the move proves the new shape, not that the behaviour survived.

```
// right: tests/checkout-tax.test.ts  — new file, named for the feature
// wrong: a 40th case appended to tests/misc.test.ts
```
