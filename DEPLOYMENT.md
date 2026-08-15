# Deployment Guide

Backend → Oracle Cloud Infrastructure (OCI) "Always Free" compute instance.
Frontend → Vercel.

Do the steps in this order — the backend needs to exist before the frontend can point at it, and the backend's CORS config needs the frontend's real URL before login/checkout will work from production.

1. [Backend on Oracle Cloud](#1-backend-on-oracle-cloud)
2. [Frontend on Vercel](#2-frontend-on-vercel)
3. [Wire them together](#3-wire-them-together)
4. [Redeploying later](#4-redeploying-later)

---

## 1. Backend on Oracle Cloud

### 1.1 Create the compute instance

1. In the [OCI Console](https://cloud.oracle.com/), go to **Compute → Instances → Create Instance**.
2. **Name**: anything, e.g. `development-rabbit-backend`.
3. **Image and shape**: click **Edit**, choose **Ubuntu 22.04** (or newer) as the image, and pick an **Always Free eligible** shape — either `VM.Standard.A1.Flex` (Ampere, up to 4 OCPU/24GB free) or `VM.Standard.E2.1.Micro`. The console labels Always Free shapes clearly.
4. **Networking**: use the default VCN/subnet, and make sure **"Assign a public IPv4 address"** is checked.
5. **SSH keys**: let OCI generate a key pair and download the private key (or paste your own public key if you already have one). You'll need this to SSH in.
6. Click **Create**, wait for the instance to reach the **Running** state, and copy its **Public IP** from the instance details page.

### 1.2 Open ports 80 and 443

This trips up almost everyone on OCI, because there are **two separate firewalls** to open — the console-level Security List, and the OS-level `iptables` rules baked into Oracle's Ubuntu image.

**Console side:**
1. From the instance details page, click the link under **Virtual Cloud Network** → then **Security Lists** → your default security list.
2. **Add Ingress Rules** for:
   - Source `0.0.0.0/0`, destination port `80` (HTTP)
   - Source `0.0.0.0/0`, destination port `443` (HTTPS)
   - (Port 22/SSH is already open by default)

**OS side** (SSH into the instance first — see 1.3 below — then run):
```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo apt install -y iptables-persistent
sudo netfilter-persistent save
```
Without this second step, ports 80/443 will look open in the console but still be unreachable from the internet.

### 1.3 SSH in and install dependencies

```bash
ssh -i /path/to/your-private-key.pem ubuntu@<your-instance-public-ip>
```

Then, on the instance:
```bash
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

node --version   # sanity check
```

### 1.4 Get the code and configure it

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>/backend
npm install --omit=dev
```

Create the real `.env` directly on the server (never commit it):
```bash
nano .env
```
Copy the structure from `backend/.env.example` and fill in real values — MongoDB URI, JWT secrets, Bunny Stream/Storage keys, Razorpay keys, OAuth client IDs/secrets. Leave `CORS_ORIGIN` for now — you'll set it in step 3 once the frontend is deployed.

Quick test:
```bash
npm start
# in another SSH session:
curl http://localhost:3000/api/v1/courses
```
`Ctrl+C` to stop once you've confirmed it responds.

### 1.5 Keep it running with PM2

```bash
sudo npm install -g pm2
pm2 start npm --name development-rabbit-backend -- start
pm2 save
pm2 startup   # run the command it prints — this makes PM2 survive a reboot
```

Useful commands going forward: `pm2 logs`, `pm2 restart development-rabbit-backend`, `pm2 status`.

### 1.6 Put Nginx in front of it (reverse proxy + HTTPS)

Create `/etc/nginx/sites-available/development-rabbit`:
```nginx
server {
    listen 80;
    server_name api.developmentrabbit.com;   # or the instance's public IP for now

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/development-rabbit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

You own `developmentrabbit.com`, so point the backend at the subdomain `api.developmentrabbit.com`: in your domain registrar's DNS settings, add an **A record** — host `api`, value the instance's public IP. DNS can take a few minutes to propagate; `dig api.developmentrabbit.com` should return the instance's IP once it has.

Once that resolves, get free HTTPS:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.developmentrabbit.com
```
Certbot rewrites the Nginx config to redirect HTTP → HTTPS and auto-renews the certificate.

### 1.7 Allow the server to reach MongoDB Atlas

In [Atlas](https://cloud.mongodb.com/) → your cluster → **Network Access** → **Add IP Address**, add the instance's public IP. Without this, `npm start` will hang trying to connect and time out.

---

## 2. Frontend on Vercel

Since GitHub's already connected to your Vercel account, this is mostly clicking through the import flow.

1. Go to [vercel.com/new](https://vercel.com/new) and import your repo.
2. **Root Directory**: click **Edit** and set it to `frontend` — this is a monorepo, and Vercel needs to know the app isn't at the repo root.
3. **Framework Preset**: Vercel should auto-detect **Vite**. Build command `npm run build`, output directory `dist` — leave the defaults.
4. **Environment Variables**, add:
   - `VITE_API_BASE_URL` → `https://api.developmentrabbit.com/api/v1` (or `http://<instance-ip>/api/v1` until DNS/HTTPS is set up)
   - `VITE_GOOGLE_CLIENT_ID` → same value as the backend's `GOOGLE_CLIENT_ID`
   - `VITE_GITHUB_CLIENT_ID` → same value as the backend's `GITHUB_CLIENT_ID`
5. Click **Deploy**.

Once it's done, Vercel gives you a URL like `https://your-app.vercel.app` — that's a working fallback, but since you own `developmentrabbit.com`, add it as the real domain: **Project Settings → Domains → Add** → enter `developmentrabbit.com` (and `www.developmentrabbit.com` if you want the `www` variant too). Vercel shows you the exact DNS records to add at your registrar (usually an `A` record for the apex domain and a `CNAME` for `www`); it then auto-provisions HTTPS once DNS resolves. A `vercel.json` is already in `frontend/` so client-side routes (e.g. `/courses`, `/cart`) won't 404 on refresh.

---

## 3. Wire them together

Now that both sides have real URLs:

1. **Backend CORS** — SSH back into the Oracle instance, edit `.env`:
   ```bash
   cd <your-repo>/backend
   nano .env
   ```
   Set `CORS_ORIGIN=https://developmentrabbit.com,https://www.developmentrabbit.com` (comma-separate more than one — also include the `https://your-app.vercel.app` fallback URL if you haven't finished pointing the custom domain at Vercel yet).
   ```bash
   pm2 restart development-rabbit-backend
   ```

2. **Google OAuth** — in [Google Cloud Console](https://console.cloud.google.com/apis/credentials), open your OAuth client → **Authorized JavaScript origins** → add `https://developmentrabbit.com` (and `https://www.developmentrabbit.com` if you're using the `www` variant).

3. **GitHub OAuth** — in [GitHub Developer Settings](https://github.com/settings/developers) → your OAuth App → **Authorization callback URL** → set it to `https://developmentrabbit.com/auth/github/callback`.

4. **Bunny Stream webhook** (if you use it) — in the Bunny dashboard, update the webhook URL to `https://api.developmentrabbit.com/api/v1/webhooks/bunny`.

5. **Smoke test**: open the Vercel URL, browse `/courses`, sign up, log in with Google/GitHub, and try adding a course to the cart. Check `pm2 logs` on the server if anything errors.

---

## 4. Redeploying later

- **Frontend**: just `git push` — Vercel auto-deploys from GitHub on every push (with preview deployments for PRs).
- **Backend**: SSH in, then:
  ```bash
  cd <your-repo>/backend
  git pull
  npm install --omit=dev   # only needed if dependencies changed
  pm2 restart development-rabbit-backend
  ```

---

## Related, from the Razorpay approval audit

Getting these two deployed doesn't by itself make you ready for Razorpay's review — see the earlier audit for what's still outstanding: real (not placeholder) `RAZORPAY_KEY_ID`/`SECRET`, at least one real published course, and a Terms & Conditions page (already added). A live HTTPS domain, which this guide gets you to, was one of the blockers on that list.
