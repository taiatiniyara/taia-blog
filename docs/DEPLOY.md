# DEPLOY — Taia's Blog

Self-hosted on a VPS with Node.js + PM2 + nginx.

---

## 1. Provision a VPS

Any provider works. Recommended specs: 1 GB RAM, 1 vCPU, 25 GB disk. Examples: Hetzner CX22, DigitalOcean Basic Droplet.

**OS:** Ubuntu 22.04 or 24.04 LTS.

---

## 2. Install system dependencies

```bash
ssh user@your-server

sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx nodejs npm

# Node 20+ required; install via NodeSource if the repo version is older:
# curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
# sudo apt install -y nodejs

sudo npm install -g pm2
```

---

## 3. Clone and build

```bash
git clone https://github.com/your-user/taia-blog.git /opt/taia-blog
cd /opt/taia-blog
npm ci

# Create .env from .env.example and fill in real values
cp .env.example .env
nano .env
```

**`.env` checklist:**

```env
DATABASE_URL=data.db
SITE_URL=https://taia.blog
AUTH_SECRET=<output of npx auth secret>
AUTH_GITHUB_ID=<GitHub OAuth app client ID>
AUTH_GITHUB_SECRET=<GitHub OAuth app client secret>
ADMIN_GITHUB_USER=<your GitHub username>
PREVIEW_TOKEN=<long random string>
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<R2 token access key>
R2_SECRET_ACCESS_KEY=<R2 token secret key>
R2_BUCKET_NAME=taia-blog
R2_PUBLIC_URL=https://<bucket>.<account-id>.r2.cloudflarestorage.com
```

Build and migrate:

```bash
npx drizzle-kit migrate
npm run build
```

---

## 4. Start with PM2

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup    # follow the instructions to enable boot-on-start
```

Check status: `pm2 status`

Logs: `pm2 logs taia-blog`

Restart after deploy: `git pull && npm ci && npx drizzle-kit migrate && npm run build && pm2 restart taia-blog`

---

## 5. nginx reverse proxy

Create `/etc/nginx/sites-available/taia-blog`:

```nginx
# Rate limiting: 10 req/s per IP, burst 20
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

server {
    listen 80;
    server_name taia.blog;
    server_tokens off;

    # Limit request body size
    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;

        # Rate limit general requests
        limit_req zone=general burst=20 nodelay;
    }

    # Stricter rate limit on auth endpoints
    location /api/auth/ {
        limit_req zone=general burst=5 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Deny hidden files
    location ~ /\. {
        deny all;
    }
}
```

Enable and test:

```bash
sudo nginx -t
sudo ln -s /etc/nginx/sites-available/taia-blog /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

---

## 6. SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d taia.blog
```

Auto-renewal is enabled by default. Test: `sudo certbot renew --dry-run`

---

## 7. Daily database backup

Add a cron job to back up the SQLite database to R2:

```bash
crontab -e
```

```
0 3 * * * cd /opt/taia-blog && npx tsx scripts/backup.ts >> /var/log/taia-backup.log 2>&1
```

This uploads a serialized copy of `data.db` to `backups/data-YYYY-MM-DD.db` in your R2 bucket every night at 3 AM.

---

## 8. Security checklist

Run these on the VPS:

```bash
# Harden SSH: disable password auth, use keys only
sudo sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/^PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Enable firewall, allow only SSH + HTTP/S
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Auto security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Verify no env files are served
curl -s -o /dev/null -w "%{http_code}" https://taia.blog/.env
# Should return 404 or 403
```

**Headers applied by Next.js** (in `next.config.ts`):
| Header | Value |
|--------|-------|
| `Content-Security-Policy` | Restricts scripts, styles, images to self + R2 |
| `Strict-Transport-Security` | 2-year HSTS with subdomains and preload |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disables camera, mic, geolocation |

**nginx hardening:**
- Rate limiting: 10 req/s general, 5 req/s burst on auth endpoints
- `server_tokens off` — hides nginx version
- `client_max_body_size 10m` — prevents oversized request attacks
- Denies access to hidden files (`/\.`)

---

## 9. Uptime monitoring

Sign up for a free [UptimeRobot](https://uptimerobot.com) account. Add a monitor for `https://taia.blog` with 5-minute checks. Set email alerts.

---

## 10. Post-deploy checklist

- [ ] Visit `https://taia.blog` — homepage loads with seed posts
- [ ] Visit `/admin/login` — "Sign in with GitHub" works
- [ ] Sign in — redirected to `/admin` dashboard
- [ ] Create a new post — TipTap editor loads
- [ ] Upload an image — appears in editor and on post page
- [ ] Publish a post — visible on homepage
- [ ] `/feed.xml` and `/sitemap.xml` return valid XML
- [ ] `/admin/login?error=unauthorized` shows the error banner
- [ ] Run `npx tsx scripts/backup.ts` manually — confirms backup works

---

## Rollback plan

If a deploy goes wrong:

```bash
git checkout <previous-commit>
npm ci
npx drizzle-kit migrate
npm run build
pm2 restart taia-blog
```

The SQLite database lives on disk; migrations are forward-only. Test migrations locally before deploying.
