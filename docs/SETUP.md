# Setup from scratch

What you need to do once, in web consoles, to get Client Desk running. Every secret goes straight into GitHub's secret store or a local `.env.local` file. Never paste one into a chat, an issue or a commit.

Phase 0 needs steps 1 to 4. Step 5 (email sending) comes in Phase 1.

## 1. Run it on your own computer (optional)

You need Node.js 22 or later (https://nodejs.org).

```
git clone https://github.com/siliconroute-ctrl/client-desk.git
cd client-desk/app
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

| Command (run in `app/`) | What it does |
| --- | --- |
| `npm run dev` | Local app with live reload |
| `npm run typecheck` | TypeScript checks |
| `npm test` | Unit tests (date logic) |
| `npm run build` | Production build into `app/dist` |
| `npm run test:e2e` | Builds, then runs the browser and accessibility tests at phone and desktop width, light and dark |

## 2. Firebase Hosting: the app's public address

You already have a Firebase account.

**Create the project**

1. Go to https://console.firebase.google.com and click **Create a project**.
2. Name it **Client Desk**. Firebase suggests a project ID under the name, such as `client-desk-1a2b3`. Write the ID down.
3. Turn **Google Analytics** off. The app doesn't need it, and leaving it off keeps tracking out of a POPIA-sensitive app. Click **Create project**.
4. Stay on the free **Spark** plan.
5. In the left menu, open **Build → Hosting** and click **Get started**. Click **Next** through the CLI screens; you don't need to run anything.

**Create a deploy-only key for GitHub.** This key can publish the website and nothing else.

6. Go to https://console.cloud.google.com/iam-admin/serviceaccounts and pick the **Client Desk** project at the top.
7. Click **+ Create service account**. Name: `github-deploy`. Click **Create and continue**.
8. Add these three roles, then click **Continue** and **Done**:
   - **Firebase Hosting Admin**
   - **API Keys Viewer**
   - **Cloud Run Viewer**
9. Click the new `github-deploy` account, open the **Keys** tab, then **Add key → Create new key → JSON → Create**. A `.json` file downloads.

**Give GitHub the key and the project ID**

10. Go to https://github.com/siliconroute-ctrl/client-desk/settings/secrets/actions.
11. Click **New repository secret**. Name: `FIREBASE_SERVICE_ACCOUNT`. Value: open the downloaded `.json` file in Notepad, select all, copy and paste. Click **Add secret**.
12. Delete the downloaded `.json` file from your computer.
13. On the same page, open the **Variables** tab. Click **New repository variable**. Name: `FIREBASE_PROJECT_ID`. Value: your project ID from step 2. Click **Add variable**.

The next merge to `main` publishes the app at `https://<project-id>.web.app`.

**Optional: use your own address, such as desk.siliconroute.com**

14. In Firebase **Hosting**, click **Add custom domain** and enter `desk.siliconroute.com`.
15. Firebase shows one or two DNS records. Add them in the Xneelo control panel under your domain's DNS. They don't touch your Office 365 records.
16. The certificate can take up to 24 hours to issue.

## 3. Supabase: the database (free plan)

**Create the project**

1. Go to https://supabase.com/dashboard and sign up with **Continue with GitHub**, using the siliconroute-ctrl account.
2. Create an organisation: name **Silicon Route**, plan **Free**.
3. Click **New project**. Name: `client-desk`.
4. Click **Generate a password** and save it in your password manager. You'll need it in step 6.
5. Region: there's no South African region. Choose **Central EU (Frankfurt)**. Click **Create new project** and wait about two minutes.

**Copy the values the app and the keep-alive need**

6. Open **Project Settings → API Keys** and copy the **Publishable key** (`sb_publishable_…`).
7. Open **Project Settings → Data API** and copy the **Project URL**.
8. Click **Connect** at the top of the project and choose **Session pooler**. GitHub's servers can't use the "Direct connection". Copy the URI and replace `[YOUR-PASSWORD]` with the password from step 4.

**Give GitHub the values.** Use https://github.com/siliconroute-ctrl/client-desk/settings/secrets/actions and add three repository secrets:

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | Project URL from step 7 |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key from step 6 |
| `SUPABASE_DB_URL` | Session pooler URI from step 8, with the password filled in |

**For local development (from Phase 1):** copy `.env.example` to `app/.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. That file is never committed.

**About the free plan:** a free project pauses after 7 days with no activity. The nightly job (step 4) checks in every night so it never sits idle, and your daily use does the same. If it ever does pause, open the dashboard and click **Restore**; no data is lost.

## 4. Nightly encrypted backup to your Google Drive

Every night at 01:15 Johannesburg time, GitHub copies the database, encrypts it with your passphrase, and uploads it to a `ClientDeskBackups` folder in your Google Drive. Copies older than 30 days are deleted. Because the file is encrypted before it leaves GitHub, Google only ever holds unreadable data.

**Choose the passphrase**

1. Create a long passphrase, for example five random words, and save it in your password manager. **Without it the backups cannot be opened**, by you or by anyone.
2. Add it as the repository secret `BACKUP_PASSPHRASE`.

**Connect Google Drive.** rclone is a free, well-known file-copy tool. You run it once on your computer to authorise access.

3. Download rclone from https://rclone.org/downloads/ and unzip it. On Windows, open the unzipped folder, type `cmd` in the address bar and press Enter.
4. Run this command, all on one line:
   ```
   rclone config create gdrive drive scope=drive.file
   ```
5. A browser window opens. Sign in with the Google account that should hold the backups, and click **Allow**. The `drive.file` scope means rclone can only see files it creates itself, not the rest of your Drive.
6. Run `rclone config file`. It prints where `rclone.conf` is saved. Open that file in Notepad and copy everything in it.
7. Add it as the repository secret `RCLONE_CONFIG`. Then delete the `rclone.conf` file, or keep it somewhere safe; it grants access to those backup files.

**Test it**

8. Go to https://github.com/siliconroute-ctrl/client-desk/actions, choose **Nightly backup and keep-alive**, click **Run workflow** and then **Run workflow** again.
9. After about a minute, the run should be green and `ClientDeskBackups` in your Drive should hold one `.dump.gpg` file.

Restoring a backup is documented and tested in Phase 5 (`docs/RUNBOOK.md`).

## 5. Email sending with Resend (Phase 1)

You'll do this in Phase 1, when sign-in links need to be sent. The steps are here for reference.

1. Sign up at https://resend.com.
2. Go to **Domains → Add domain** and enter `notify.siliconroute.com`. A subdomain keeps these records separate from your Office 365 email records.
3. Resend lists three or four DNS records: a DKIM `TXT`, plus an `MX` and an SPF `TXT` under `send.notify`. Add them in Xneelo's DNS editor, then click **Verify** in Resend.
4. Create an API key with **Sending access** only. Store it as a Supabase Edge Function secret named `RESEND_API_KEY`; Phase 1 gives the exact steps.

## Deploy and rollback

- **Deploy:** merge into `main`. GitHub runs every check, and only if all of them pass does it publish to Firebase Hosting.
- **Roll back:** in the Firebase console, go to **Hosting → Release history**, find the last good release, open its **⋮** menu and choose **Rollback**. The old version is live within seconds. Then fix the problem on a branch and merge again.
