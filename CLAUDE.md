# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`@42.nl/react-url` — A TypeScript library for type-safe URL building and query parameter handling in React Router applications. Provides both hook (`useQueryParams`) and HOC (`withQueryParams`) APIs.

## Commands

- **Full test suite:** `npm test` (runs lint + type check + coverage with 100% threshold)
- **Run tests only:** `npx vitest run`
- **Run single test:** `npx vitest run tests/queryparams.test.ts`
- **Run tests matching pattern:** `npx vitest run -t "should parse query params"`
- **Watch mode:** `npm start`
- **Lint:** `npm run lint`
- **Type check:** `npm run test:ts`
- **Build:** `npm run tsc` (outputs to `lib/`)
- **Release:** `npm run release` (uses `np`)

## Architecture

All source is in `src/`, tests mirror structure in `tests/`.

**Data flow:** `urlBuilder` orchestrates `pathParamsBuilder` (substitutes `:param` placeholders) and `queryParamsBuilder` (appends query string, filtering out defaults). For reading params, `queryParamsFromLocation` parses `location.search` and converts types based on provided defaults.

**Key modules:**
- `pathParamsBuilder.ts` — Replaces `:id`, `:tab?` path placeholders; handles optional params
- `queryParamsBuilder.ts` — Builds query strings via `query-string`, omitting params matching defaults
- `urlBuilder.ts` — Composes path + query params into full URL (generic over PathParams/QueryParams)
- `queryparams.ts` — Parses location.search into typed objects using defaults for type inference
- `useQueryParams.ts` — React hook wrapping `queryParamsFromLocation`
- `withQueryParams.tsx` — HOC alternative injecting `queryParams` prop

**Public API** (from `index.ts`): `Url`, `urlBuilder`, `withQueryParams`, `useQueryParams`, `queryParamsFromLocation`

## Conventions

- **100% test coverage** required (branches, functions, lines, statements)
- ESM module format (`"type": "module"` in package.json)
- Prettier: single quotes, no trailing commas
- TypeScript strict mode with `noUnusedLocals`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- Peer dependency on React 17/18/19 — no React in production deps
- Pure functions throughout; no thrown errors, only console warnings for missing defaults
- JSDoc with `@example` blocks on all public functions
