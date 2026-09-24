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
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Key Design Decisions](#key-design-decisions)
- [Security Highlights](#security-highlights)
- [Testing](#testing)
- [Deployment Notes](#deployment-notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Espresso & Co.** is a production-style e-commerce application for a specialty coffee roastery, demonstrating a complete, secure, end-to-end shopping experience — from browsing and cart management to checkout, order tracking, and product reviews, backed by a full admin operations console.

The project follows a decoupled architecture: a REST API (Node/Express/Prisma) serves a separate single-page React application, with JWT-based authentication, Redis-backed rate limiting, and PostgreSQL as the primary datastore. Every mutation that touches stock or money (checkout, cancellation, stock adjustments) runs inside a Prisma database transaction to guarantee consistency under concurrent access.

## Screenshots

> _Add screenshots or a short demo GIF here to give reviewers an immediate sense of the product. Suggested shots: Shop page with filters, Product page with reviews, Cart, Checkout, Admin dashboard._

| Shop | Product & Reviews | Admin Console |
|---|---|---|
| ![Shop page](docs/screenshots/shop.png) | ![Product page](docs/screenshots/product.png) | ![Admin console](docs/screenshots/admin.png) |

## Features

### Customer-facing
- Email/password authentication with email verification and password reset flows
- Product catalog with search, category filtering, price range, and sorting
- Persistent shopping cart (server-synced for logged-in users, local fallback for guests) with per-item pending-state protection against duplicate/racing requests
- Stock-aware checkout with atomic order creation and inventory management
- Order history and order detail views, with self-service cancellation of pending orders
- Product reviews: create, edit, and delete your own review; browse others' reviews and the aggregate rating
- Toast-based feedback for every key action (cart, checkout, reviews)

### Admin console
- Full CRUD on products (with image uploads) and categories
- Order management with a status state machine (`PENDING → PROCESSING → SHIPPED → DELIVERED`) and cancellation
- Customer management: role assignment and email-verification override
- Review moderation: view all reviews platform-wide, delete individually or in bulk
- CSV export for every data tab (products, categories, orders, customers, reviews)
- Dashboard metrics: inventory health, open orders, registered accounts

### Platform / security
- JWT access tokens + httpOnly, rotated refresh token cookies with server-side revocation
- Redis-backed token-bucket rate limiting on sensitive endpoints (login, password reset, reviews, products)
- Zod schema validation on every request body/query/params, with `.strict()` bodies to reject unexpected fields
- Role-based access control (`USER` / `ADMIN`) enforced via middleware on every protected route
- Helmet + a strict CORS allow-list (no wildcard origins on credentialed requests)
- Swagger/OpenAPI documentation served at `/api-docs`

## Architecture

```mermaid
flowchart LR
    subgraph Client
        A[React SPA - Vite and TypeScript]
    end

    subgraph Server[Express API]
        B[Auth: JWT + refresh cookies]
        C[Products / Categories]
        D[Cart / Orders]
        E[Reviews]
        F[Admin]
    end

    G[(PostgreSQL via Prisma)]
    H[(Redis rate limiting)]
    I[SMTP - Nodemailer]

    A -->|REST / JSON| B
    A --> C
    A --> D
    A --> E
    A --> F

    B --> G
    C --> G
    D --> G
    E --> G
    F --> G

    B -.rate limit.-> H
    C -.rate limit.-> H
    E -.rate limit.-> H

    B -->|verification / reset emails| I
```

The frontend never talks to PostgreSQL or Redis directly — every read and write goes through the Express API, which owns all business rules (stock checks, ownership checks, role checks) so the client can't bypass them.

## Data Model

```mermaid
erDiagram
    User ||--o{ Product : "lists (admin)"
    User ||--o| Cart : owns
    User ||--o{ Order : places
    User ||--o{ Review : writes
    User ||--o{ RefreshToken : holds

    Category ||--o{ Product : groups

    Cart ||--o{ CartProduct : contains
    Product ||--o{ CartProduct : "in"

    Order ||--o{ OrderItem : contains
    Product ||--o{ OrderItem : "ordered as"

    Product ||--o{ Review : receives
    Product ||--o{ Image : has

    User {
        int id PK
        string email UK
        string password
        bool isVerified
        enum role
    }
    Product {
        int id PK
        string name
        decimal price
        int stock
        int categoryId FK
    }
    Order {
        int id PK
        int userId FK
        decimal total
        enum status
    }
    Review {
        int id PK
        int userId FK
        int productId FK
        int rating
        string comment
    }
```

### Checkout sequence

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client (React)
    participant A as API
    participant DB as PostgreSQL

    U->>C: Click "Place Order"
    C->>A: POST /orders { items }
    A->>DB: BEGIN TRANSACTION
    A->>DB: Check stock for every item
    alt insufficient stock
        DB-->>A: fail
        A-->>C: 409 Insufficient stock
        C-->>U: Toast: out of stock
    else stock available
        A->>DB: Create Order + OrderItems
        A->>DB: Decrement product stock
        A->>DB: Clear user's cart
        DB-->>A: COMMIT
        A-->>C: 201 Order created
        C-->>U: Redirect to Orders page
    end
```

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

Create a `.env` file in `server/` (see [Environment Variables](#environment-variables)), then run the database migrations:

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

The API runs at `http://localhost:5000`. Interactive API docs are served at `http://localhost:5000/api-docs` once the server is running.

### Frontend Setup

```bash
cd public/files
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Set `VITE_API_URL` in a `.env` file in this directory if the backend runs somewhere other than `http://localhost:5000`.

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

> **Note:** Generate long, random values for every `JWT_*` secret — never reuse sample values in any deployed environment. Rotate them immediately if a `.env` file is ever committed by mistake.

## API Overview

| Area | Base path | Auth | Notes |
|---|---|---|---|
| Auth | `/auth` | Mixed | Register, login, refresh, verify email, password reset |
| Products | `/products` | Public | Search/filter/sort/paginate, rate-limited |
| Categories | `/categories` | Public | Category list |
| Cart | `/cart` | User | Per-user cart, embeds full product details |
| Orders | `/orders` | User | Order history, checkout, cancellation |
| Reviews | `/reviews` | Mixed | Public read (by `productId`); authenticated create/edit/delete of your own review |
| Admin | `/admin/*` | Admin | Products, categories, users, orders, reviews |

Full request/response schemas are documented via Swagger at `/api-docs`.

## Key Design Decisions

- **Stock integrity over convenience.** Every operation that changes stock (checkout, cancellation) is wrapped in a Prisma transaction with a stock check immediately before the write, so two concurrent checkouts can never oversell the same unit.
- **Ownership enforced server-side, not just hidden in the UI.** A user can only edit/delete their own reviews — enforced with an explicit `userId` check in the service layer, returning `403` even if the client is bypassed entirely (e.g. via a direct API call).
- **Cart embeds product data instead of N+1 fetching.** `GET /cart` returns full product/category/image data in one query, rather than requiring the client to fetch each cart item's product individually — this also keeps the client well under the product-listing rate limit during normal use.
- **Fail loud, not silent.** Stock and validation failures use a typed `AppError` (with an HTTP status) rather than generic `Error` objects, so the global error handler returns the correct status code instead of masking a `409`/`404` as a `500`.

## Security Highlights

- Passwords hashed with bcrypt; refresh tokens hashed at rest and rotated on every use
- Refresh tokens stored as httpOnly, `sameSite=strict` cookies scoped to `/auth`
- Redis token-bucket rate limiting on login, password reset, resend-verification, product listing, and review creation
- Ownership checks on all user-mutable resources
- CORS restricted to an explicit origin allow-list — never `*` on credentialed requests

## Testing

Automated test coverage is intentionally scoped as a separate, upcoming pass (see [Roadmap](#roadmap)). In the meantime, every change is manually verified end-to-end in the browser against the running API before being merged, and Swagger (`/api-docs`) is kept up to date as a living contract for manual API testing.

## Deployment Notes

- Set `NODE_ENV=production` to enable HSTS via Helmet and disable verbose error output.
- Point `CLIENT_URL` and the CORS allow-list at your production frontend origin.
- Use a managed PostgreSQL and Redis instance in production; run `npx prisma migrate deploy` (not `migrate dev`) as part of your deploy step.
- Serve the frontend (`public/files`) as a static build (`npm run build`) behind a CDN or static host, pointed at the deployed API via `VITE_API_URL`.

## Roadmap

- [ ] Automated test suite (unit + integration)
- [ ] Payment gateway integration
- [ ] Wishlist / saved-for-later
- [ ] Order status email notifications
- [ ] Dockerized local development environment

## Contributing

Issues and pull requests are welcome. Please open an issue describing the change before submitting a large PR, and keep commits scoped and descriptive.

## License

Distributed under the ISC License.

---

<p align="center">Built by <a href="https://github.com/Ahmed-Saedd-DEV">Ahmed Saeed</a></p>
