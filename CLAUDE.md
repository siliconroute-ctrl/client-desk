# Client Desk — notes for Claude Code sessions

Read `docs/BUILD_BRIEF.md` in full before any work. It is the source of truth for scope, phases and rules.

## Status

- Phase 0 in progress on branch `phase-0`: scaffold, CI, deploy pipeline and nightly backup written. Waiting on the owner to finish docs/SETUP.md steps 2 to 4 (Firebase, Supabase, Google Drive) so the first deploy and backup can run.

## Commands (run in `app/`)

- `npm run dev` · `npm run typecheck` · `npm test` (Vitest) · `npm run build` · `npm run test:e2e` (Playwright + axe; four projects: phone/desktop × light/dark).
- In the Claude Code cloud container, run e2e with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`; don't run `playwright install` there.
- `app/.npmrc` sets `legacy-peer-deps=true`: npm 10 crashes resolving this tree's optional peer sets without it.
- Pin dependency versions exactly and choose releases at least two weeks old.

## Design system

- The design system lives at https://claude.ai/artifact/9Ut43MYrTjkyzgLmFUeuWW: tokens, type, components with guidelines, and usage rules. Read its README before building any UI.
- `app/src/styles/tokens.css` holds the compiled design tokens, light and dark. It follows the system theme, and `data-theme="light|dark"` on `<html>` overrides it.
- `app/src/styles/components.css` holds the component styles (`cd-` class prefix). Fonts are self-hosted through `@fontsource` packages (no Google Fonts calls), so they work offline and the CSP stays `'self'`.
- `docs/design-tokens.json` is the token source. Change tokens there (or in the design system), then regenerate `tokens.css`. Never hard-code colours.
- Port components as typed `.tsx` files that keep the props from the design system's `components/index.d.ts`.

## Conventions

- Timezone `Africa/Johannesburg` for all "today" and "overdue" logic. Dates display as "Fri 30 Oct". Money is stored as integer cents (ZAR) and displayed as `R 48 250.00`.
- Text is 18px base and never below 16px. Tap targets are at least 44px. Never show state by colour alone. Never use `alert()` or `confirm()`.

## Decisions log

| Date | Decision |
| --- | --- |
| 2026-10-23 | Repo created and seeded with the build brief and design tokens. |
| 2026-10-23 | Owner answers (brief section 10): Android phone; works alone, single owner account for now (multi-tenant model stays, Phase 4 stays late); mail in three places: Gmail, Outlook.com, and siliconroute.com on Microsoft 365 Exchange; budget R100 a month; has Firebase and Google Cloud, no Supabase or Resend; client data scattered in Notepad/Word files and in Zoho Books. |
| 2026-10-23 | **Supabase Free plan, not Pro** (deviates from brief section 3) because of the R100 budget. Mitigations: a nightly GitHub Action pings Supabase so the project never idles 7 days, and takes a pg_dump encrypted with GPG (AES-256, passphrase in a GitHub secret) to the owner's Google Drive via rclone (`drive.file` scope), keeping 30 days. Revisit Pro (about R450 a month) if others come to rely on the app. |
| 2026-10-23 | **Region: Central EU (Frankfurt).** Supabase has no Cape Town region (checked 23 Oct 2026). POPIA cross-border transfer to the EU to be confirmed by a lawyer; noted for docs/PRIVACY.md. |
| 2026-10-23 | **Debtors: keep Zoho Books** (Standard plan) as the ledger; do not build our own invoices, credit notes, payments, PDFs or statements. Phase 2B becomes a read-only Zoho Books connection: Outstanding, Overdue and top-five debtors tiles, plus "Chase [client]: [invoice] overdue" tasks. Brief section 2A and the 2B schema tables are out of scope unless the owner reverses this. Zoho contacts export is also a source for the Phase 1 client import. |
| 2026-10-23 | **Important mail: forwarding route only (Phase 3a)**, for all three mailboxes. Phase 3b (Gmail API) dropped because it covers only one of three. Microsoft 365 may block external auto-forwarding by default; the admin setting must allow it. |
| 2026-10-23 | **Email sending: Resend** (free plan, 100 a day) from `notify.siliconroute.com`, so its DNS records don't touch the Office 365 records on the root domain. DNS is at Xneelo, managed by the owner. Supabase's built-in SMTP is too rate-limited for sign-in links. |
| 2026-10-23 | **Hosting: Firebase Hosting** on the Spark plan, deployed from GitHub Actions with a deploy-only service account; optional custom domain `desk.siliconroute.com`. Strict CSP (`script-src 'self'`), so no inline scripts. |
