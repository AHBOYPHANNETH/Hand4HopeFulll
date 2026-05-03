# Hand4Hope full-stack platform

Hand4Hope (Hands of Hope Community) is a sample NGO web platform for Cambodia-focused programs supporting children with intellectual disabilities. This repository contains:

- **frontend**: React (Vite), React Router, Axios, Tailwind CSS v4  
- **backend**: Laravel 12 REST API with Sanctum tokens and Google OAuth via Socialite  
- **database**: MySQL (SQLite supported for local demos)

## Prerequisites

- PHP 8.2+, Composer, Node.js 20+, npm  
- MySQL 8+ **or** SQLite (the sample `.env.example` defaults to SQLite for quick local demos)  

## Backend setup (`backend/`)

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
```

Configure `.env`:

- Set **database** credentials: keep SQLite for demos, or uncomment the MySQL block in `.env.example` and create a `hand4hope` schema.  
- Set **APP_URL** to your API origin (for example `http://localhost:8000`).  
- Set **FRONTEND_URL** to your React origin (for example `http://localhost:5173`).  
- Add **Google OAuth** credentials: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Authorized redirect URI must match  
  `${APP_URL}/auth/google/callback` (for example `http://localhost:8000/auth/google/callback`).  
- Optional **MAIL_ADMIN_ADDRESS** for donation/contact/volunteer notification copies (uses `MAIL_MAILER=log` locally).  

Then migrate and seed (creates demo admin + sample events/content):

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Default admin login from `.env.example` seed:

- Email: `admin@hand4hope.test`  
- Password: `password` (override via `ADMIN_EMAIL` / `ADMIN_PASSWORD` before seeding)

## Frontend setup (`frontend/`)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`VITE_API_URL` must point at the Laravel API root including `/api`, for example `http://localhost:8000/api`.

### Google sign-in UX

The navbar **Continue with Google** button performs a full-page redirect to  
`${APP_URL}/auth/google/redirect`. After approval, Laravel issues a Sanctum token and redirects to  
`${FRONTEND_URL}/auth/google/callback?token=...&user=...`. The React route stores the token in `localStorage` and attaches it to Axios requests.

## API highlights

| Area | Routes |
| --- | --- |
| Auth | `POST /api/register`, `POST /api/login`, `POST /api/logout`, `GET /api/user` |
| OAuth web | `GET /auth/google/redirect`, `GET /auth/google/callback` |
| Public | `GET /api/events`, `GET /api/events/{id}`, `POST /api/donations`, `POST /api/contacts`, `GET /api/site-contents` |
| Volunteers | `POST /api/events/{event}/volunteer` (requires Bearer token) |
| Admin | `GET /api/admin/analytics`, CRUD `/api/admin/events`, listings for donations/contacts, `GET|PUT /api/admin/site-contents` |

Admin routes require `Authorization: Bearer <token>` for a user whose `role` column equals `admin`.

## Project structure

```
backend/
  app/Http/Controllers/Api/...
  app/Mail/...
  database/migrations/...
  routes/api.php
frontend/
  src/components/...
  src/pages/...
  src/services/...
  src/api/client.js
```

## Notes

- Event banner uploads are stored on the `public` disk (`storage/app/public/events`) and exposed via `php artisan storage:link`.  
- Email classes live under `app/Mail` with Markdown templates in `resources/views/mail`.  
- Adjust **CORS_ALLOWED_ORIGINS** in `backend/.env` when deploying separate domains.
