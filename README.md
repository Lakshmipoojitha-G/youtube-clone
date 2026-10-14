# YouTube Clone – MyTube

A full‑stack YouTube‑like platform built with **Next.js 13**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **PostgreSQL**.

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 13 (App Router), React 19, Tailwind CSS, shadcn/ui |
| **Auth** | NextAuth.js – credentials + Google OAuth |
| **Database** | PostgreSQL (via Prisma ORM) |
| **Storage** | S3 / Mux (Member 2) |
| **Cache / Rate‑limit** | Redis (Member 3) |
| **CI** | GitHub Actions |
| **Deploy** | Vercel / Docker |

---

## 🚀 Getting Started

### Prerequisites
- Node 20+
- PostgreSQL 15+
- A Google Cloud Console project (for OAuth)

### 1. Clone & install
```bash
git clone https://github.com/Lakshmipoojitha-G/youtube-clone.git
cd youtube-clone
git checkout foundation
npm install
```

### 2. Set environment variables
```bash
cp .env.example .env
# Fill in DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
```

### 3. Database setup
```bash
# Start Postgres (Docker)
docker run -d --name pg-mytube -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=youtube_clone postgres:15-alpine

# Run migrations
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run dev server
```bash
npm run dev
# Visit http://localhost:3000
```

---

## 📂 Project Structure (Atomic Design)

```
app/                        Next.js app router pages & API routes
├─ api/
│   ├─ auth/               NextAuth routes + register
│   ├─ channels/           Channel CRUD + subscribe
│   ├─ notifications/      Notification list + mark-read
│   └─ users/profile/      Profile GET + PATCH
├─ auth/signin/            Sign-in page
├─ auth/register/          Registration page
├─ channel/[handle]/       Channel page
├─ subscriptions/          Subscription feed
├─ profile/                Profile settings
└─ settings/channel/       Create channel

src/
├─ components/
│   ├─ atoms/              Button, Avatar (smallest UI pieces)
│   ├─ molecules/          SearchBar, NotificationBell, SubscribeButton
│   ├─ organisms/          Navbar, Sidebar
│   ├─ templates/          MainLayout
│   └─ providers/          SessionProvider
├─ lib/
│   ├─ auth.ts             NextAuth config
│   ├─ prisma.ts           Prisma client singleton
│   └─ utils.ts            cn(), formatCount(), timeAgo()

prisma/
└─ schema.prisma           All DB models

.github/workflows/ci.yml   CI pipeline
```

---

## 👥 Team Branches

| Member | Branch | Responsibility |
|--------|--------|---------------|
| **M1 (You)** | `foundation` | Auth, Layout, Channels, Subscriptions, Notifications, CI |
| M2 | `feature/studio` | Video upload, Studio dashboard, Mux/S3 pipeline |
| M3 | `feature/watch` | Watch page, HLS player, Comments, Likes, History |
| M4 | `feature/discovery` | Home feed, Search, Playlists, Trending |

### Merge workflow
```
feature/studio ─────────┐
feature/watch  ──────────┤──▶  foundation  ──▶  main
feature/discovery ───────┘
```
Each member opens a **Pull Request** into `foundation`. The team lead (Member 1) reviews and merges. CI must be green before merging.

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | App public URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |

---

## 🚢 Deployment

### Vercel (recommended)
1. Link the repo in Vercel dashboard.
2. Set all env vars in the Vercel project settings.
3. Vercel auto-detects Next.js – no extra config needed.

### Docker
```bash
docker build -t mytube .
docker run -p 3000:3000 --env-file .env mytube
```
