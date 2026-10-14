# Folder structure and ownership

One repo, one project. Each member owns their folders. Shared files go through the owner listed below.

| Member | GitHub | Area |
|---|---|---|
| M1 | harshavardhan1424 | Foundation, auth, users, layout, channels, subscriptions, notifications |
| M2 | (not pushed yet) | Video upload, Studio, storage |
| M3 | Pulvanthi | Watch page, player, likes, comments, history, liked videos |
| M4 | Likitha | Home feed, search, trending, playlists, shorts |

## M1 - Foundation, auth, users

- `src/components/` (atoms, molecules, organisms, templates, providers)
- `src/lib/` (`auth.ts`, `prisma.ts`, `utils.ts`)
- `app/auth/`, `app/channel/`, `app/profile/`, `app/settings/`, `app/subscriptions/`, `app/welcome/`
- `app/api/auth/`, `app/api/channels/`, `app/api/notifications/`, `app/api/users/`
- `app/layout.tsx`, `middleware.ts`, `prisma/`, `Dockerfile`, `docker-compose.yml`, `.github/workflows/`
- `types/next-auth.d.ts`

## M2 - Upload and Studio (not in the repo yet)

- `app/studio/`, `app/api/upload/`
- `components/studio/`
- `server/storage/`, `server/video.service.ts` (create, update, delete)

## M3 - Watch and engagement

- `app/watch/[videoId]/`
- `app/feed/history/`, `app/feed/liked/`
- `app/api/videos/[videoId]/` (`like`, `view`, `progress`)
- `app/api/comments/`
- `components/video/` : `VideoPlayer`, `LikeButtons`, `ShareDialog`, `RelatedVideos`
- `components/comments/`
- `server/comment.service.ts`, `server/video-engagement.service.ts`, `server/store.ts`, `server/seed-videos.ts`
- `types/video.ts`, `validators/comment.ts`

## M4 - Discovery, search, playlists

- `app/(main)/` (home feed), `app/results/`, `app/shorts/`, `app/playlist/`
- `app/feed/trending/`, `app/feed/subscriptions/`
- `app/api/feed/`, `app/api/search/`, `app/api/playlists/`
- `components/layout/`, `components/search/`, `components/playlist/`, `components/shorts/`, `components/ui/`
- `components/video/VideoCard.tsx`, `components/video/VideoGrid.tsx`
- `services/` (`search`, `recommendation`, `playlist`), `context/`, `lib/mockData.ts`
- `types/index.ts`, `app/discovery.css`

## Shared files (change only after telling the owner)

| File | Owner |
|---|---|
| `prisma/schema.prisma`, `app/layout.tsx`, `middleware.ts`, `package.json` | M1 |
| `components/video/VideoCard.tsx` (used by M1, M3, M4) | M4 |

## Known leftovers to clean up

- M4 has loose copies at the repo root: `playlist.service.ts`, `recommendation.service.ts`, `search.service.ts`. The real ones are in `services/`.
- `components/layout/` (M4's Header and Sidebar) is not used. The app uses M1's `src/components/organisms/Navbar` and `Sidebar`.
- `app/page.tsx` was moved to `app/welcome/page.tsx` because M4's `app/(main)/page.tsx` also serves `/`.
- M3 `server/` files use in-memory data until M1's Prisma schema is wired in.

Check who last changed a folder: `git log --format="%an | %s" -- <path>`
