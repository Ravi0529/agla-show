## AglaShow — Ticket Booking App

AglaShow is a full‑stack movie ticket booking app with **OTP auth**, **movie listings**, **showtimes**, **seat selection with locking**, and **Razorpay payments**.

It’s built with a modern TypeScript stack (React + Node/Express) and designed with a clean UI.

---

## Tech stack

### Frontend (`/client`)

- **React 19** + **TypeScript**
- **React Router**
- **React Hook Form**
- **Tailwind CSS** (responsive UI)
- **lucide-react** (icons)
- **Axios** (API calls)
- **Razorpay Checkout** (payment UI via script loader)

### Backend (`/server`)

- **Node.js** + **Express**
- **TypeScript**
- **Zod** (request/body validation)
- **PostgreSQL** + **Drizzle ORM**
- **JWT auth** (`Authorization: Bearer <token>`)
- **BullMQ + Redis** (background jobs / workers)
- **Nodemailer** (OTP emails)
- **Multer** + **ImageKit** (movie poster upload)
- **Razorpay** (create orders + signature verification)

---

## Core flows

### 1) Authentication (Signup → OTP → Login)

- User signs up with name/email/password.
- Server generates a **6‑digit OTP** (valid for **10 minutes**), stores it, and queues an email job.
- User verifies OTP.
- User logs in and receives a **JWT token**, stored in `localStorage`.

### 2) Movies

- Admin-like flow (API) can create movies with a poster.
- Posters are uploaded to **ImageKit** and stored as URLs.
- Users can browse movies, open movie details, and proceed to showtimes.

### 3) Shows

- Shows belong to a movie + screen + theatre.
- Show listings include:
  - `startTime`
  - `price`
  - screen name
  - theatre name + location

### 4) Seats

- Seats are created per show (1..N).
- Seat statuses:
  - **available**
  - **locked**
  - **booked**
- UI shows a responsive seat map with a screen indicator at the bottom.

### 5) Booking + Payment (Razorpay)

- On **Pay & Book**:
  - Server creates a booking (`pending`)
  - Locks seats for the user
  - Creates a Razorpay **order**
- Razorpay Checkout opens on the frontend.
- On success:
  - Frontend calls `verify-payment`
  - Server verifies Razorpay signature
  - Seats become **booked**
  - Booking becomes **confirmed**

### Seat lock expiry (5 minutes)

Seat locks are treated as active only for ~5 minutes. A recurring job releases expired locks.

---

## Monorepo structure

```text
agla-show/
  client/   # React + TS frontend (Vite)
  server/   # Express + TS backend (Drizzle, Redis/BullMQ workers)
```

---

## Getting started (local)

### Prerequisites

- **Node.js** (recent LTS recommended)
- **PostgreSQL**
- **Redis**
- **Razorpay test keys** (for local payments)
- **ImageKit** keys (for poster uploads)
- **Gmail SMTP creds** (or app password) for Nodemailer

---

## Environment variables

### Client (`client/.env`)

Copy from `client/.env.example`:

```env
VITE_BACKEND_URI=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

Notes:

- In Vite, env vars must start with **`VITE_`**.
- `VITE_BACKEND_URI` should include `/api` because the server mounts routes under `/api/*`.

### Server (`server/.env`)

Copy from `server/.env.example`:

```env
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/aglashow
JWT_SECRET=your_jwt_secret

EMAIL_USER=you@gmail.com
EMAIL_PASS=your_gmail_app_password

REDIS_URL=redis://localhost:6379

IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

---

## Install & run

### 1) Install dependencies

```bash
cd server
npm install
```

```bash
cd ../client
npm install
```

### 2) Database migrations (server)

```bash
cd server
npm run db:generate
npm run db:migrate
```

Optional: open Drizzle Studio

```bash
npm run studio
```

### 3) Run backend + workers

The backend uses BullMQ workers for email and seat cleanup.

**Recommended (everything together):**

```bash
cd server
npm run dev:all
```

This runs:

- API server (`npm run dev`)
- Email worker (`npm run worker:email:dev`)
- Seat worker (`npm run worker:seat:dev`)

### 4) Run frontend

```bash
cd client
npm run dev
```

Open the app at the Vite URL (usually `http://localhost:5173`).

---

## Useful scripts

### Client

- `npm run dev`: start Vite dev server
- `npm run build`: typecheck + build
- `npm run preview`: preview production build

### Server

- `npm run dev`: watch + build + run server
- `npm run dev:all`: server + workers together
- `npm run build`: build TypeScript
- `npm run start`: run compiled server from `dist`
- `npm run worker:email:dev`: run email worker in TS mode
- `npm run worker:seat:dev`: run seat worker in TS mode
- `npm run db:generate`: generate Drizzle migrations
- `npm run db:migrate`: apply migrations
- `npm run studio`: Drizzle Studio UI

---

## API overview (high level)

Base URL: `${VITE_BACKEND_URI}` (example: `http://localhost:5000/api`)

- **Auth**
  - `POST /auth/signup`
  - `POST /auth/signin`
  - `POST /auth/verify-otp`
  - `GET /auth/me`

- **Movies**
  - `GET /movie/get-all-movies`
  - `GET /movie/:id`
  - `POST /movie/create` (poster upload via multer + ImageKit)

- **Shows**
  - `GET /show/movie/:movieId`

- **Seats**
  - `GET /seat/:showId` (protected)

- **Booking**
  - `POST /booking/create` (protected; locks seats + creates Razorpay order)
  - `POST /booking/verify-payment` (protected; verifies signature + confirms booking)

---

## Notes / troubleshooting

- **CORS**: server is configured for `http://localhost:5173` by default.
- **Razorpay key error** (“Authentication key was missing…”): ensure `VITE_RAZORPAY_KEY_ID` is set and restart the client dev server.
- **Seat locks not releasing**: ensure Redis is running and the **seat worker** is running (`npm run worker:seat:dev` or `npm run dev:all`).
