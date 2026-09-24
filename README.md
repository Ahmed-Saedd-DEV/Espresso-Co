# ☕ Espresso & Co.

A full-stack specialty coffee e-commerce platform — built with a Node.js/Express/Prisma backend and a React/TypeScript frontend, featuring authenticated shopping, order management, product reviews, and a full admin console.

[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Security Highlights](#security-highlights)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

**Espresso & Co.** is a production-style e-commerce application for a specialty coffee roastery, built to demonstrate a complete, secure, end-to-end shopping experience — from browsing and cart management to checkout, order tracking, and product reviews, backed by a full admin operations console.

The project follows a decoupled architecture: a REST API (Node/Express/Prisma) serves a separate single-page React application, with JWT-based authentication, Redis-backed rate limiting, and PostgreSQL as the primary datastore.

## Features

### Customer-facing
- Email/password authentication with email verification and password reset flows
- Product catalog with search, category filtering, price range, and sorting
- Persistent shopping cart (server-synced for logged-in users, local fallback for guests)
- Stock-aware checkout with atomic order creation and inventory management
- Order history and order detail views
- Product reviews: create, edit, and delete your own reviews; view others' reviews and average ratings
- Toast-based feedback for all key actions (cart, checkout, reviews)

### Admin console
- Full CRUD on products (with image uploads) and categories
- Order management with status transitions and cancellation
- Customer management: role assignment and email-verification override
- Review moderation: view all reviews platform-wide, delete individually or in bulk
- CSV export for every data tab (products, categories, orders, customers, reviews)
- Dashboard metrics: inventory health, open orders, registered accounts

### Platform / security
- JWT access tokens + httpOnly refresh token cookies with rotation and revocation
- Redis-backed token-bucket rate limiting on sensitive endpoints (login, password reset, reviews, products)
- Zod schema validation on every request body/query/params
- Role-based access control (`USER` / `ADMIN`) via middleware
- Helmet + strict CORS allow-list
- Swagger/OpenAPI documentation at `/api-docs`

## Tech Stack

**Backend**
- Node.js + Express 5
- Prisma 7 (`@prisma/adapter-pg`) + PostgreSQL
- Redis (rate limiting, caching)
- JWT (`jsonwebtoken`), bcrypt
- Zod (validation)
- Multer (file uploads), Nodemailer (transactional email)
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)

**Frontend**
- React 18 + TypeScript
- Vite
- React Router 7
- Tailwind CSS

## Project Structure

```
Espresso-Co/
├── server/                     # Backend API
│   ├── src/
│   │   ├── controllers/        # Request handlers (users/ and admin/)
│   │   ├── services/           # Business logic (users/ and admin/)
│   │   ├── routes/             # Express routers
│   │   ├── middleware/         # Auth, validation, rate limiting
│   │   ├── validators/         # Zod schemas
│   │   ├── utils/              # Shared helpers (errors, JWT, pagination, etc.)
│   │   ├── prisma/             # Prisma client instance
│   │   └── main.js             # App entry point
│   └── prisma/
│       └── schema.prisma       # Database schema
└── public/
    └── files/                  # Frontend (Vite/React app)
        ├── src/
        │   ├── pages/          # Route-level views
        │   ├── components/     # Reusable UI components
        │   ├── contexts/       # Auth and Cart providers
        │   ├── api/            # Typed API client modules
        │   └── types/          # Shared TypeScript types
        └── index.html
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- An SMTP account for transactional email (e.g. Gmail with an app password)

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (see [Environment Variables](#environment-variables) below), then run the database migrations:

```bash
npx prisma migrate deploy   # or: npx prisma migrate dev
npx prisma generate
```

Start the API:

```bash
npm run dev      # development, with nodemon
npm start        # production
npm run studio   # open Prisma Studio to inspect the database
```

The API runs at `http://localhost:5000` by default. Interactive API docs are available at `http://localhost:5000/api-docs` once the server is running.

### Frontend Setup

```bash
cd public/files
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default. Set `VITE_API_URL` in a `.env` file in this directory if the backend runs somewhere other than `http://localhost:5000`.

## Environment Variables

Create `server/.env` with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/espressoandco?schema=public"

# Auth
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EMAIL_VERIFICATION_SECRET=
JWT_PASSWORD_RESET_SECRET=

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# URLs
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:5000

# Cache / rate limiting
REDIS_URL=redis://localhost:6379

# Environment
NODE_ENV=development
```

> **Note:** Generate long, random values for every `JWT_*` secret — never reuse the sample values above in any deployed environment.

## API Overview

| Area | Base path | Notes |
|---|---|---|
| Auth | `/auth` | Register, login, refresh, verify email, password reset |
| Products | `/products` | Public catalog, search/filter/sort/paginate |
| Categories | `/categories` | Public category list |
| Cart | `/cart` | Authenticated, per-user cart |
| Orders | `/orders` | Authenticated order history and checkout |
| Reviews | `/reviews` | Public read, authenticated create/edit/delete of your own reviews |
| Admin | `/admin/*` | Admin-only: products, categories, users, orders, reviews |

Full request/response schemas are documented via Swagger at `/api-docs`.

## Security Highlights

- Passwords hashed with bcrypt; refresh tokens hashed at rest and rotated on use
- Refresh tokens stored as httpOnly, `sameSite=strict` cookies scoped to `/auth`
- Redis token-bucket rate limiting on login, password reset, resend-verification, product listing, and review creation
- Ownership checks on all user-mutable resources (a user can only edit or delete their own reviews)
- Stock and order-integrity checks run inside database transactions to prevent overselling or partial writes

## Roadmap

- [ ] Automated test suite (unit + integration)
- [ ] Payment gateway integration
- [ ] Wishlist / saved-for-later
- [ ] Order status email notifications

## License

Distributed under the ISC License.

---

<p align="center">Built by <a href="https://github.com/Ahmed-Saedd-DEV">Ahmed Saeed</a></p>