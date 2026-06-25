# Contributing to Marro

## Git identity — use a per-person alias (the repo is public)

This repo is public, and we keep contributors' real names/emails out of the commit
history. Each collaborator commits under a **distinct alias**, not their real name.

When you clone, set your identity **for this repo only** (not `--global`):

```bash
git config user.name  "YourAlias"
git config user.email "<id>+<YourAlias>@users.noreply.github.com"
```

Rules:
- **Email must be your GitHub `noreply` address** — never a personal, school, or work
  email. Find it at GitHub → Settings → Emails → "Keep my email addresses private"
  (it looks like `12345678+YourAlias@users.noreply.github.com`).
- **Name is an alias**, not your legal name. Pick one and keep it consistent.
- For true public anonymity, the **GitHub account itself should be an alias account**
  too — the noreply email contains the GitHub username, so a real-name username would
  defeat the purpose. (The founder commits as `MarroGit`.)
- Repo ownership lives in the **`Marro-app`** GitHub org; personal accounts that are org
  members should set their org membership visibility to **Private**.

Internal attribution (who did what, by real name) lives in the private
`marro-ops/` records, never in the public repo.

## Before you push

- `main` auto-deploys to Vercel on push — **don't push to `main` without the team's OK.**
- Never commit secrets. `.gitignore` blocks `.env*` and key files, but double-check.
- New Supabase table? RLS is auto-enabled (deny-all) — add `auth.uid()` policies and
  commit them to `supabase/*.sql`, or the table silently reads empty. See `CLAUDE.md` §4.
- UI changes must meet WCAG 2.1 AA and follow Apple HIG — see `CLAUDE.md` rules 7–9.
