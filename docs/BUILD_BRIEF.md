# Client Desk: Claude Code Build Brief

How to use this: save it in the project folder as `docs/BUILD_BRIEF.md`, open Claude Code in that folder and type: Read docs/BUILD_BRIEF.md in full, then follow section 0. Everything below the line is the prompt.

---

## 0. Your role and how to work with me

You are the lead engineer building Client Desk, a cloud-hosted client, duties, due-date, reminder and important-email tracker with a dashboard, for phone and desktop. A working prototype already exists (section 2), so this is a production rebuild on a real cloud database, not a blank-page design.

Working rules:

* Build in the phases in section 6. Before each phase, give me a short plain-language summary of the business implications (cost, risk, what it unlocks) and only then the technical detail. At the end of each phase, stop, tell me exactly how to try it, and wait for my go-ahead.
* Build simple first, then automate. Where something can be done manually first (for example importing clients by CSV before building integrations), do that first.
* Ask me questions only for the open decisions in section 10. For everything else, use the defaults stated here and note what you chose.
* I am technical (IT business owner) but not a full-time developer. When I must do something in a web console (create an account, copy a key), give numbered click-by-click steps. Never ask me to paste secrets into chat. Secrets go into `.env.local` or the host's secret store, and `.env.example` documents every variable.
* Commit at every milestone with clear messages. Keep a `CLAUDE.md` in the repo recording conventions, commands and decisions so later sessions stay consistent.
* Verify anything time-sensitive (pricing, regions, Google and Apple policies, library versions) against current documentation at build time instead of relying on memory. Tell me what you verified.

## 1. Who I am and how this will be used

* I am Joao de Gois. I run Silicon Route, a South African IT business covering IT support, e-commerce, content creation and app development. Timezone is South Africa Standard Time (UTC+2, no daylight saving). Currency ZAR. Dates display like "Fri 30 Oct".
* Today it is for me alone: my clients, my daily duties, my due dates, my reminders, and mail from a short list of important senders.
* Later it may be shared with a bigger firm: colleagues would see shared clients and tasks, be assigned work, and have roles. So the data model must be multi-tenant from day one. Retrofitting this later is the expensive mistake to avoid.
* I have restricted vision. Accessibility is a hard requirement, not polish (section 7).
* I will use it on both phone and desktop daily. It must be installable as a PWA and feel quick on a mobile connection.

## 2. What the app does (port of the prototype)

Six areas. The first five are in the prototype, a single-page app with these exact modules; keep the behaviour, improve the foundations. The sixth, Debtors, is new (section 2A).

* Dashboard: tiles for Overdue, Due today, Next 7 days, Reminders due, Unread important mail, plus Outstanding and Overdue invoice totals from Debtors. Panels: "Needs attention" (overdue and due-today tasks plus due reminders), "Next 14 days" bar chart of tasks per day, "Open work by client" bars, and "Mail from watched senders". A red banner appears when reminders are due.
* Clients: name, company, contact person, email, phone, status (Active, Prospect, Dormant), notes. Search across all fields. A client page shows their open work, details with copy buttons for email and phone, reminders, and watched senders linked to them.
* Tasks: title, optional due date, client link, type (Day-to-day duty or Deadline), priority (Normal or High), notes, and repeat (none, daily, weekly, monthly). Ticking a repeating task moves it to its next due date instead of closing it. Filters: Open, Overdue, Next 7 days, Done, All, plus a client filter. Sorted soonest first.
* Reminders: title, date and time, optional client, note. Groups: Due now, Later today, Upcoming, Recently done. Done, edit and snooze (+1 day).
* Important mail: a list of watched senders (full address or whole domain), each with an optional label and optional client. Shows threads from those senders for the last 7, 30 or 90 days, unread first, with an Unread-only toggle, an Open-in-Gmail link and a Handled button.

## 2A. Debtors: simple billing and payments

Debtors answers one question: who owes me what, and how late are they? It is a debtors ledger, not an accounting package. Keep it small and reliable.

* Invoices: per client, with an automatic invoice number (prefix plus sequence per organisation, for example INV-0001), issue date, due date from payment terms (default 30 days, editable per client), line items (description, quantity, unit price), optional VAT at 15%, and total. Statuses: Draft, Issued, Part-paid, Paid, Overdue (calculated from the due date, never typed) and Void. An issued invoice cannot be edited or deleted. To correct one, void it and issue a credit note or a new invoice.
* Credit notes: simple, raised against one invoice, reducing what the client owes.
* Payments: captured by hand when money arrives, usually by EFT: client, date, amount, method, reference. One payment can be allocated across several invoices, part-payment is allowed, and an unallocated amount shows as client credit.
* Statements and ageing: a statement per client (invoices, payments, balance) and an ageing summary with Current, 1 to 30, 31 to 60, 61 to 90 and 90+ days overdue. A debtors list across all clients sorted by amount owing, with totals.
* Documents: invoice and statement as PDF, a "Send by email" button that attaches the PDF and records when it was sent, and a saved log of every send.
* Chasing: when an invoice becomes overdue, create one task "Chase [client]: [invoice] overdue" for the invoice owner, and show it in Needs attention on the dashboard. Provide three reminder-email templates (friendly, firm, final) that I can edit, and log when each is sent.
* Dashboard: Outstanding total, Overdue total, and the top five debtors.
* Organisation billing settings: legal name, address, registration number, VAT-registered yes or no with VAT number, bank details printed on invoices, invoice prefix and next number, default payment terms, logo and footer text.
* Money rules: store amounts as integer cents in ZAR, one currency per organisation, with documented and tested rounding. Totals, balances and ageing are calculated in the database (views or functions), never recomputed in the browser. Invoice numbers are sequential and gap-free per organisation, using a locked counter row so two people issuing at once cannot clash.
* Permissions: amounts are visible only to owners, admins and members granted a billing permission (`can_bill`). Everyone else sees client and task data but no money. Enforce this in RLS like every other table, and keep amounts and bank details out of logs.
* Tax invoices: if the organisation is VAT-registered, invoices must meet SARS tax-invoice requirements. Check SARS's current rules, show me a checklist of the fields required, and I will confirm it with my accountant. Do not treat your own summary as final.
* Not included: general ledger, creditors and bills, stock, payroll, bank feeds, card or payment links. Leave room for them: stable invoice IDs, a payment reference per invoice, and a CSV export of invoices, payments and clients in a standard layout, so a payment gateway (PayFast, Yoco or Ozow) or an export to Xero or Sage can be added later.

## 3. Architecture and defaults

Use these unless you find a strong reason, and tell me if you deviate.

* Database and backend: Supabase (Postgres, Auth, Row Level Security, Edge Functions, scheduled jobs). Reasons: relational data suits clients-to-tasks; RLS gives real per-organisation isolation in the database itself; it is standard Postgres, so a firm can move it to its own hosting later. Check whether the Cape Town (af-south-1) region is available and use it, since my data is South African. Check current plan limits: free projects can pause when idle, which is unacceptable for a daily tool, so plan for a paid tier in production and tell me the monthly cost.
* Frontend: React + TypeScript + Vite, as an installable PWA. TanStack Query for data, React Router for routes, Zod for validation, plain CSS with design tokens (no heavy UI kit).
* Hosting of the frontend: Firebase Hosting (I already use it) unless something else is clearly better.
* Email sending (digests, invites): Resend or Supabase's SMTP; tell me which and why.
* Repo layout: `/app` (frontend), `/supabase` (migrations, seed, edge functions, tests), `/docs`. All schema changes are versioned SQL migrations, never edited by hand in the console.

## 4. Multi-tenant model (this is the important part)

* Every user gets a personal organisation automatically at sign-up, so solo use is just an organisation with one member. No special solo mode exists in the code.
* A user can belong to many organisations and switch between them (my own, plus a firm's later). The active organisation is always visible in the header.
* Roles per membership: owner, admin, member, viewer. Owner and admin manage members and settings. Member creates and edits records. Viewer is read-only.
* Invites: an admin invites by email, the invitee signs up or signs in and accepts. Invites expire.
* Every business table carries `org_id`. RLS on every table restricts rows to organisations the signed-in user belongs to, and write permission follows role. No table may ever be readable without a policy.
* Tasks and reminders have `assigned_to` (a member) and a `private` flag. Private items are visible only to their creator. Default is visible to the whole organisation.
* The owner can export all organisation data (JSON and CSV) and delete the organisation, and this must be tested. Data portability is a selling point for a firm.
* Record `created_by`, `updated_by`, timestamps and soft-delete (`deleted_at`) on business rows, plus an activity log of create, update and delete with who and when.

## 5. Schema (Postgres, timestamptz everywhere)

Design these tables, with sensible indexes (org_id plus due date, org_id plus client) and constraints:

* `profiles` (id = auth user, display name, timezone default `Africa/Johannesburg`, notification preferences)
* `organisations`, `memberships` (org, user, role), `invites`
* `clients` (name, company, contact, email, phone, status enum, notes)
* `tasks` (title, client_id, due_date date, kind enum, priority enum, status enum open or done, repeat enum, last_done, done_at, notes, assigned_to, private)
* `reminders` (title, remind_at timestamptz, client_id, note, done, assigned_to, private, snoozed_until)
* `watched_senders` (address or domain, label, client_id)
* `email_items` (org, sender, subject, snippet, received_at, source, external_id, unread, handled_by, handled_at, link)
* `activity_log`, `push_subscriptions`

Add for Debtors (section 2A):

* `invoice_counters` (org, prefix, next_number, locked per issue), `invoices` (client_id, number, issue_date, due_date, status, vat_rate, subtotal_cents, vat_cents, total_cents, notes, sent_at, voided_at, voided_reason), `invoice_lines`
* `credit_notes` (invoice_id, number, date, amount_cents, reason), `payments` (client_id, paid_on, amount_cents, method, reference), `payment_allocations` (payment_id, invoice_id, amount_cents)
* `email_log` (document type, document id, to, sent_at, template used)
* A view `invoice_balances` (amount due per invoice) and a function for ageing buckets. Billing settings as columns on `organisations`, `payment_terms_days` and `billing_email` on `clients`, and a `can_bill` flag on `memberships`.

Store dates as dates and instants as `timestamptz`. All "today", "overdue" and digest logic uses the user's timezone, never the server's.

## 6. Phases

Phase 0: decisions and scaffold. Ask me the questions in section 10. Create the repo, `CLAUDE.md`, `.env.example`, the Supabase project setup steps, CI, and a deploy pipeline that publishes a hello-world PWA at a real URL.

Phase 1: accounts, organisations, core records. Sign-in by email magic link and Google. Personal organisation on sign-up, org switcher, full CRUD for clients and tasks, the dashboard, CSV import for clients, all RLS policies with automated tests proving that user A can never read or write user B's organisation.

Phase 2: reminders and notifications. Reminders UI, in-app due banner, a daily digest email at 07:00 South Africa time (overdue, today, next 3 days, reminders due), and web push for due reminders. Note that iPhone push only works once the PWA is added to the Home Screen; document this in the in-app help.

Phase 2B: debtors. Organisation billing settings, invoices from draft to issued, PDF generation, manual payment capture and allocation, credit notes, statements, ageing, dashboard tiles and the overdue chase tasks. Before building email sending, show me a sample invoice PDF and statement for approval. Tests must cover money rounding, gap-free numbering under concurrent issue, ageing edge cases, and that a member without `can_bill` cannot read any amounts.

Phase 3: important mail. Build in this order and stop after 3a for my review:

* 3a, forwarding (default, simplest). I create a Gmail filter that forwards mail from my chosen senders to a private inbound address. An Edge Function receives and stores the message metadata and a short snippet, matched to watched senders. No Google verification needed.
* 3b, Gmail API sync (only if I approve). Read-only OAuth, tokens encrypted server-side, never exposed to the browser. Check Google's current rules first. A consumer Gmail account in "Testing" status has refresh tokens that expire after about seven days, and read access to mail is a restricted scope that needs verification for public use. Lay out these trade-offs and the cost before building anything.
* Whichever route: store the minimum (sender, subject, short snippet, date, link), never full bodies or attachments, and let me purge stored mail.

Phase 4: firm features. Invites and roles UI, assignment, "my work" versus "everyone's work" views, activity log screen, organisation export and deletion, member removal that reassigns their work.

Phase 5: hardening. Backups and a tested restore, error monitoring, rate limiting, security headers and CSP, a one-page privacy and data-handling document, and a runbook for me.

## 7. UI and accessibility (non-negotiable)

* Reproduce the prototype's look. Fonts: Atkinson Hyperlegible for text (designed for low vision) and Bricolage Grotesque for headings. Base text 18px, never below 16px anywhere, and the app must stay usable at 200% browser zoom and with the phone's largest font setting.
* Tokens (light): background `#EEF2F6`, surface `#FFFFFF`, ink `#0A1724`, muted `#3C4D61`, accent `#0B54C9`, good `#0A6B36`, warning `#8A4A00`, critical `#B00F1F`. Dark: background `#0A1219`, surface `#121D28`, ink `#F4F8FC`, muted `#B4C2D1`, accent `#7DB2FF`, good `#6FE0A0`, warning `#FFC670`, critical `#FF9AA2`. Follow the system theme, with a manual light and dark toggle that is remembered.
* Contrast at least WCAG AA everywhere, aiming for AAA on body text. Never use colour alone to show state: pair it with a word or icon (for example the "3 days overdue" pill).
* Tap targets at least 44px. Every control reachable and operable by keyboard with a clearly visible focus ring. Proper labels, landmarks and live regions so a screen reader works. Respect reduced motion.
* Layout: left navigation rail on desktop, bottom tab bar on phones, no horizontal scrolling at 400px width. No `alert()` dialogs, and destructive actions use an in-page two-step confirm.
* Run automated accessibility checks (axe) in CI and fail the build on serious violations.

## 8. Security and privacy

* Client contact details are personal information under South Africa's POPIA. Keep data in the chosen region where possible, collect only what the app needs, support deletion and export, and draft a short plain-language privacy notice and data-handling summary. Flag anything that needs a lawyer, since you are not giving legal advice.
* The service-role key never reaches the browser. Validate all input on server and client. Parameterised queries only. Least-privilege database roles.
* Sign-in: magic link and Google, optional MFA for admins, session expiry, and rate limits on auth and inbound email endpoints.
* Secrets only in environment or the host's secret store. Add a pre-commit check that blocks committed secrets.
* Log security-relevant events without logging personal content.

## 9. Testing and definition of done

* Unit tests for date logic (overdue, repeat, next month with short months, timezone edges around midnight in Johannesburg).
* Database tests proving tenant isolation and role limits, including attempts to read another organisation's rows by guessing IDs.
* End-to-end tests (Playwright) for the main flows at phone width and desktop width, in light and dark.
* Lighthouse PWA and accessibility audits pass. Installable on Android and on iPhone.
* Each phase is done only when tests pass, the deployed URL works, the README steps reproduce the setup from scratch, and I have tried it.

## 10. Ask me these first (Phase 0)

1. Do I use an iPhone or Android phone? (Changes how push notifications work.)
2. Will other people use this in the next three months? If yes, how many and what roles? (Decides how early to build Phase 4.)
3. Which Google account is my work mail, and is it a personal Gmail or Google Workspace? (Decides the mail route.)
4. Monthly budget for hosting and email sending, in rand.
5. Do I already have accounts at Supabase, Firebase, Resend and Google Cloud, or must you guide me through creating them?
6. Any existing client list (spreadsheet or CSV) to import in Phase 1?

Also ask me before Phase 2B:

* Am I VAT-registered, and what must appear on my invoices?
* What invoice number format and starting number do I want, and do I have open invoices to import as opening balances?
* What default payment terms and which bank details should print on invoices?
* Do I already use accounting software (Xero, Sage, QuickBooks) that this must export to or stay consistent with?
* Who in the firm may see amounts owing?

## 11. Deliverables

Working deployed app, repository with migrations and tests, `README.md` (setup from scratch, environment variables, deploy, rollback), `CLAUDE.md`, `docs/PRIVACY.md`, `docs/RUNBOOK.md` (backups, restore, adding a user, rotating keys, what to do if the app is down), and a short cost summary per month at 1 user and at 10 users.

Out of scope for now: full accounting (general ledger, creditors, payroll, stock), bank-feed matching, online card payments, time tracking, a client portal and WhatsApp reminders. Do not build these, but do not design in a way that blocks them.
