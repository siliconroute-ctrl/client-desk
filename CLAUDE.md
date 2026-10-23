# Client Desk — notes for Claude Code sessions

Read `docs/BUILD_BRIEF.md` in full before any work. It is the source of truth for scope, phases and rules.

## Status

- Phase 0 not started. The section 10 questions have not been answered yet.

## Design system

- The design system lives at https://claude.ai/artifact/9Ut43MYrTjkyzgLmFUeuWW: tokens, type, components with guidelines, and usage rules. Read its README before building any UI.
- `app/src/styles/tokens.css` holds the compiled design tokens, light and dark. It follows the system theme, and `data-theme="light|dark"` on `<html>` overrides it.
- `app/src/styles/components.css` holds the component styles (`cd-` class prefix).
- `docs/design-tokens.json` is the token source. Change tokens there (or in the design system), then regenerate `tokens.css`. Never hard-code colours.
- Port components as typed `.tsx` files that keep the props from the design system's `components/index.d.ts`.

## Conventions

- Timezone `Africa/Johannesburg` for all "today" and "overdue" logic. Dates display as "Fri 30 Oct". Money is stored as integer cents (ZAR) and displayed as `R 48 250.00`.
- Text is 18px base and never below 16px. Tap targets are at least 44px. Never show state by colour alone. Never use `alert()` or `confirm()`.

## Decisions log

| Date | Decision |
| --- | --- |
| 2026-10-23 | Repo created and seeded with the build brief and design tokens. |
