# Monthly running costs

Budget: **R100 a month**. Rand amounts below are approximate and use about R18 to the US dollar; check the current rate before relying on them. Prices were checked on 23 Oct 2026 and should be checked again before any upgrade.

| Service | What it's for | 1 user (you) | Later, about 10 users |
| --- | --- | --- | --- |
| Supabase | Database, sign-in, server functions | Free plan: R0. Pauses after 7 idle days; the nightly job prevents that | Pro: US$25, about R450. Daily backups, no pausing, support |
| Firebase Hosting | Serves the app | Spark (free): R0. 10 GB stored, 360 MB a day transferred | Still R0 at this size |
| Resend | Sign-in links, daily digests | Free: R0. 3,000 emails a month, 100 a day | Still R0. One digest a day for 10 people is about 300 emails a month |
| GitHub | Code, checks, deploys, nightly backup | Free: R0. 2,000 Actions minutes a month for private repositories; this uses roughly 300 to 500 | R0 |
| Google Drive | Encrypted backups | Free 15 GB: R0. Backups are a few MB each, 30 kept | R0 |
| Zoho Books | Invoicing and debtors (kept as is) | Your existing Standard plan; Client Desk only reads from it | No change |
| Domain siliconroute.com | App address, email sender | Already paid | No change |
| **Total added cost** | | **R0** | **About R450**, when moving to Supabase Pro |

## What the free plan means in practice

- **No service guarantee.** Supabase can change its free terms; we'll check them at each phase.
- **Backups are ours, not Supabase's.** The nightly job is the only backup. A restore test is part of Phase 5.
- **When to upgrade:** if anyone else starts relying on the app daily, or if one bad day of downtime would cost more than R450.

Sources: [Supabase pricing summary](https://www.nocode.mba/articles/supabase-pricing), [Supabase regions](https://supabase.com/docs/guides/platform/regions), [Resend pricing](https://resend.com/pricing.md), [Zoho Books API limits](https://www.zoho.com/en-sg/books/kb/automation/per-day-api-limit.html).
