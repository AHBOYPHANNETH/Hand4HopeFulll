# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two-app monorepo:

- `backend/` — Laravel 12 REST API (PHP 8.2+, Sanctum tokens, Socialite for Google OAuth, Bakong KHQR integration)
- `frontend/` — React 19 + Vite 8 SPA (React Router v7, Tailwind v4 via `@tailwindcss/vite`, Axios)

There is **no root-level package** — every command is run from inside `backend/` or `frontend/`.

## Commands

### Backend (`cd backend`)

| Task | Command |
| --- | --- |
| Install + bootstrap (.env, key, migrate, npm) | `composer setup` |
| Run all dev processes (server + queue + pail logs + vite) | `composer dev` |
| Just the API server | `php artisan serve` |
| Migrate + reseed | `php artisan migrate:fresh --seed` |
| Symlink storage for event banners | `php artisan storage:link` |
| Run tests | `composer test` (clears config then `php artisan test`) |
| Single test | `php artisan test --filter=TestName` |
| Lint/format | `./vendor/bin/pint` |
| Sanity-check Bakong account + sample KHQR | `php artisan bakong:check {account?}` |

### Frontend (`cd frontend`)

| Task | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Lint | `npm run lint` |
| Preview built bundle | `npm run preview` |

`VITE_API_URL` (e.g. `http://localhost:8000/api`) drives [src/config.js](frontend/src/config.js); `BACKEND_ORIGIN` is derived by stripping `/api` so storage URLs resolve correctly.

## Architecture — the parts that span files

### Auth: Sanctum bearer tokens + Google OAuth bridge

- `POST /api/register` and `POST /api/login` return a plain-text Sanctum token; the React client stores it in `localStorage` under `hand4hope_token` and attaches it via Axios defaults — see [src/api/client.js](frontend/src/api/client.js) and [src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx).
- Google OAuth lives on the **web** routes (not `/api`): [routes/web.php](backend/routes/web.php) → [GoogleAuthController](backend/app/Http/Controllers/GoogleAuthController.php). The callback issues a Sanctum token, then **redirects to the frontend** with `?token=...&user=...` (user is a base64-encoded JSON blob). The frontend's `/auth/google/callback` route reads those params and calls `loginWithToken`.
- On any 401, the Axios interceptor wipes `hand4hope_token` / `hand4hope_user` and clears the Authorization header — backend tokens that no longer validate are reaped client-side automatically.
- The `auth:sanctum` middleware groups in [routes/api.php](backend/routes/api.php) wrap everything user-scoped; admin endpoints additionally go through the `admin` alias registered in [bootstrap/app.php](backend/bootstrap/app.php) → [EnsureUserIsAdmin](backend/app/Http/Middleware/EnsureUserIsAdmin.php), which checks `user.role === 'admin'`.

### Admin section is a separate React subtree

In [src/App.jsx](frontend/src/App.jsx), `/admin/*` mounts `AdminLayout` (own sidebar/topbar) gated by `AdminRoute`; the public site mounts the shared `Layout` (Navbar + Footer). The two trees do not share chrome — when adding a feature, decide which tree it belongs to first.

### Donations: legacy `store` vs. KHQR flow

Three donation endpoints in [DonationController](backend/app/Http/Controllers/Api/DonationController.php):

1. `POST /api/donations` — legacy offline path: writes the row directly with `status=paid` and emails a receipt.
2. `POST /api/donations/khqr/initiate` — creates a `pending` `Donation`, generates a KHQR via [KhqrBuilder](backend/app/Services/Bakong/KhqrBuilder.php), stores `qr_string` + `md5`, returns the QR payload.
3. `GET /api/donations/khqr/{donation}/status` — polled by the frontend; calls [BakongClient::checkTransactionByMd5](backend/app/Services/Bakong/BakongClient.php) and, on `responseCode === 0` with `data` present, flips status to `paid`, stores `bakong_hash`, and fires `DonationReceived` mail (to donor + optional admin copy from `mail.admin_address`).

Bakong config (token, base URL, merchant identity that gets baked into every QR) is in [config/bakong.php](backend/config/bakong.php) — never hardcode the merchant ID in controller code. Env keys: `BAKONG_BASE_URL`, `BAKONG_TOKEN`, `BAKONG_MERCHANT_ID` (the Bakong account, e.g. `name@bank`), `BAKONG_CURRENCY` (default when request omits one), and `INTENT_EXPIRY_MINUTES` (server marks pending donations `expired` past this window — enforced in `khqrStatus`, surfaced via the `expires_at` column). Use the `bakong:check` artisan command to verify a merchant ID before relying on it.

### Site content is a key/value CMS

[SiteContent](backend/app/Models/SiteContent.php) is a flat `key -> value` table seeded by [DatabaseSeeder](backend/database/seeders/DatabaseSeeder.php) (hero copy, mission/vision, contact details, impact stats, `testimonials_json`). The admin "Content" page reads/writes these via `GET|PUT /api/admin/site-contents`. The public site reads them via `GET /api/site-contents`. When adding a new editable field, seed a default in `DatabaseSeeder` *and* surface it in both the admin form and the public consumer — there is no schema migration step for new keys.

### Event volunteering has a status workflow

`event_volunteers` is a pivot with extra columns (`name`, `email`, `phone`, `date_of_birth`, `notes`, `status`) — added across migrations `2026_05_04_000009` and `2026_05_08_000001`. `status` is one of `pending` / `approved` / (rejected). [Event](backend/app/Models/Event.php) computes `volunteers_count` from rows whose status is `pending` OR `approved` (both consume a seat), and `is_full` compares against `capacity`. If you add a new status, update `volunteers_count` accordingly — capacity math depends on it.

### Notification polling

[AuthContext](frontend/src/context/AuthContext.jsx) polls `GET /api/notifications` every 10 s while a token is present and exposes `unreadNotifications` + `refreshNotificationCount()` to the rest of the app. The poller is keyed on `[token, user]` and tolerates network errors silently. The polling cadence lives in this file — there is no config knob.

### Storage / image URLs

Event banners go to the `public` disk under `storage/app/public/events`. [Event::getImageUrlAttribute](backend/app/Models/Event.php) returns `asset('storage/...')`, which requires `php artisan storage:link` to have been run. Frontend code that constructs absolute URLs for these assets uses `BACKEND_ORIGIN` from [src/config.js](frontend/src/config.js).

### Mail

- Mailables in [app/Mail/](backend/app/Mail/): `DonationReceived`, `ContactSubmitted`, `VolunteerRegistered`.
- Admin notification copies are routed via `config('mail.admin_address')` (set `MAIL_ADMIN_ADDRESS` in `.env`). Local dev defaults to `MAIL_MAILER=log`.

## Conventions worth knowing

- API JSON shape: controllers `return response()->json([...])` directly (no API resources layer). Match the existing shape when adding endpoints — the frontend reads fields by exact name.
- The frontend stores both the token (`hand4hope_token`) and a cached user JSON (`hand4hope_user`) in `localStorage`; on boot, `AuthContext` re-validates the token by calling `GET /api/user` and discards both if the call fails.
- Tailwind v4 is wired via the Vite plugin — there is no `postcss.config.js` and no `@apply` of custom utilities by default; tweak [tailwind.config.js](frontend/tailwind.config.js) when adding theme tokens.
- Admin login from the seed: `admin@hand4hope.test` / `password` (override with `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars **before** seeding).
