# Deployment Guide

Backend → Render (Web Service).
Frontend → Vercel.

Do the steps in this order — the backend needs to exist before the frontend can point at it, and the backend's CORS config needs the frontend's real URL before login/checkout will work from production.

1. [Backend on Render](#1-backend-on-render)
2. [Frontend on Vercel](#2-frontend-on-vercel)
3. [Wire them together](#3-wire-them-together)
4. [Redeploying later](#4-redeploying-later)

---

## 1. Backend on Render

### 1.1 Create the Web Service

1. Go to the [Render Dashboard](https://dashboard.render.com/) → **New → Web Service**.
2. Connect your GitHub account (if not already) and select this repo.
3. **Root Directory**: `backend` — this is a monorepo, and Render needs to know the app isn't at the repo root.
4. **Runtime**: Node.
5. **Build Command**: `npm install`.
6. **Start Command**: `npm start`.
7. **Instance Type**: Free is fine to start, but note it spins down after inactivity and cold-starts (~30-60s) on the next request — upgrade to a paid instance if that's a problem for login/checkout flows.

### 1.2 Environment variables

In the service's **Environment** tab, add the variables from `backend/.env.example` with real values — MongoDB URI, JWT secrets, Bunny Stream/Storage keys, Razorpay keys, OAuth client IDs/secrets. Leave `CORS_ORIGIN` for now — you'll set it in step 3 once the frontend is deployed.

Render sets `PORT` itself, so you don't need to add it — the app already reads `process.env.PORT`.

Click **Create Web Service**. Render builds and deploys automatically; watch the **Logs** tab for the first boot.

### 1.3 Confirm it's up

Render gives you a URL like `https://development-rabbit-backend.onrender.com` immediately, with HTTPS already provisioned — no Nginx/certbot/DNS work required to get a working HTTPS endpoint.

```bash
curl https://development-rabbit-backend.onrender.com/api/v1/courses
```

If you own `developmentrabbit.com` and want the API on `api.developmentrabbit.com` instead of the `onrender.com` URL: **Settings → Custom Domain → Add Custom Domain**, enter `api.developmentrabbit.com`, then add the CNAME record Render shows you at your domain registrar. Render auto-provisions HTTPS for the custom domain too once DNS resolves.

### 1.4 Allow the server to reach MongoDB Atlas

Render's outbound IPs aren't static on the free/starter tiers, so in [Atlas](https://cloud.mongodb.com/) → your cluster → **Network Access** → **Add IP Address**, either add Render's published outbound IP ranges (see Render's docs for your region) or, simplest for a small project, allow `0.0.0.0/0` and rely on your DB user's password for access control. Without this, the app will hang trying to connect and time out.

---

## 2. Frontend on Vercel

Since GitHub's already connected to your Vercel account, this is mostly clicking through the import flow.

1. Go to [vercel.com/new](https://vercel.com/new) and import your repo.
2. **Root Directory**: click **Edit** and set it to `frontend` — this is a monorepo, and Vercel needs to know the app isn't at the repo root.
3. **Framework Preset**: Vercel should auto-detect **Vite**. Build command `npm run build`, output directory `dist` — leave the defaults.
4. **Environment Variables**, add:
   - `VITE_API_BASE_URL` → `https://api.developmentrabbit.com/api/v1` (or the `https://development-rabbit-backend.onrender.com/api/v1` URL from step 1.3 until the custom domain is wired up)
   - `VITE_GOOGLE_CLIENT_ID` → same value as the backend's `GOOGLE_CLIENT_ID`
   - `VITE_GITHUB_CLIENT_ID` → same value as the backend's `GITHUB_CLIENT_ID`
5. Click **Deploy**.

Once it's done, Vercel gives you a URL like `https://your-app.vercel.app` — that's a working fallback, but since you own `developmentrabbit.com`, add it as the real domain: **Project Settings → Domains → Add** → enter `developmentrabbit.com` (and `www.developmentrabbit.com` if you want the `www` variant too). Vercel shows you the exact DNS records to add at your registrar (usually an `A` record for the apex domain and a `CNAME` for `www`); it then auto-provisions HTTPS once DNS resolves. A `vercel.json` is already in `frontend/` so client-side routes (e.g. `/courses`, `/cart`) won't 404 on refresh.

---

## 3. Wire them together

Now that both sides have real URLs:

1. **Backend CORS** — in the Render dashboard, open the backend service → **Environment**, set `CORS_ORIGIN=https://developmentrabbit.com,https://www.developmentrabbit.com` (comma-separate more than one — also include the `https://your-app.vercel.app` fallback URL if you haven't finished pointing the custom domain at Vercel yet), and save. Render redeploys the service automatically when an env var changes.

2. **Google OAuth** — in [Google Cloud Console](https://console.cloud.google.com/apis/credentials), open your OAuth client → **Authorized JavaScript origins** → add `https://developmentrabbit.com` (and `https://www.developmentrabbit.com` if you're using the `www` variant).

3. **GitHub OAuth** — in [GitHub Developer Settings](https://github.com/settings/developers) → your OAuth App → **Authorization callback URL** → set it to `https://developmentrabbit.com/auth/github/callback`.

4. **Bunny Stream webhook** (if you use it) — in the Bunny dashboard, update the webhook URL to `https://api.developmentrabbit.com/api/v1/webhooks/bunny`.

5. **Smoke test**: open the Vercel URL, browse `/courses`, sign up, log in with Google/GitHub, and try adding a course to the cart. Check the **Logs** tab on the Render service if anything errors.

---

## 4. Redeploying later

- **Frontend**: just `git push` — Vercel auto-deploys from GitHub on every push (with preview deployments for PRs).
- **Backend**: just `git push` too — Render auto-deploys from GitHub on every push to the connected branch (runs the Build Command, then restarts with the Start Command). Watch progress in the service's **Events**/**Logs** tab; if a deploy fails, Render keeps the previous version running.

---

## Related, from the Razorpay approval audit

Getting these two deployed doesn't by itself make you ready for Razorpay's review — see the earlier audit for what's still outstanding: real (not placeholder) `RAZORPAY_KEY_ID`/`SECRET`, at least one real published course, and a Terms & Conditions page (already added). A live HTTPS domain, which this guide gets you to, was one of the blockers on that list.
