# Peregrine Goods Co.

A premium fullstack e-commerce experience for an everyday-carry atelier selling
**shoes · backpacks · lunch boxes · handbags · travel bags** — built with
Next.js (App Router), PostgreSQL via Drizzle ORM, Tailwind CSS v4,
Framer Motion and Lenis smooth scrolling.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![Stack](https://img.shields.io/badge/PostgreSQL-Drizzle-blue) ![Stack](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## Features

- **Editorial storefront** — cursor-following collection index, parallax campaign
  sections, marquee tickers, spring-physics motion, film-grain finish
- **Full commerce flow** — catalog with search/filter/sort, collection pages,
  product detail with gallery + variants, quick-add, cart drawer with
  free-shipping meter, validated checkout with animated confirmation
- **Real backend** — PostgreSQL schema (categories, products, orders,
  order_items, subscribers) with transactional order placement, stock
  decrement and server-side price validation
- **API routes** — `GET /api/products`, `GET /api/products/:slug`,
  `POST /api/orders`, `POST /api/newsletter`, `GET /api/health`
- **Catalog** — seeded with 5 categories and 20 richly described goods

## Stack

| Layer     | Tech                                        |
| --------- | ------------------------------------------- |
| Framework | Next.js 16 (App Router, RSC)                |
| Language  | TypeScript                                  |
| Database  | PostgreSQL + Drizzle ORM                    |
| Styling   | Tailwind CSS v4                             |
| Motion    | Framer Motion + Lenis                       |
| State     | Zustand (persisted cart)                    |
| Fonts     | Fraunces + Archivo (next/font)              |

## Getting started

```bash
# 1. install dependencies
npm install

# 2. configure the database
cp .env.example .env        # then set DATABASE_URL

# 3. push schema & seed the catalog (5 categories, 20 products)
npx drizzle-kit push
npx tsx src/db/seed.ts

# 4. run
npm run dev                 # http://localhost:3000
```

Production:

```bash
npm run build && npm start
```

## Project structure

```
src/
├── app/                  # routes: /, /shop, /collections/[slug],
│   │                     # /product/[slug], /checkout, /api/*
│   ├── api/              # products, orders, newsletter, health
│   └── ...
├── components/           # header, footer, cart drawer, home sections,
│                         # product card, gallery, purchase panel
├── db/                   # schema, client, queries, seed
├── lib/                  # utils, product mappers
└── store/                # zustand cart store
```

## Deployment

This app requires a Node.js server and PostgreSQL database — the simplest
production path is **Vercel** + a managed Postgres (Neon, Supabase or Vercel
Postgres):

```bash
npx vercel                 # link & deploy
# add DATABASE_URL as an env var in the project settings
# then run: npx drizzle-kit push && npx tsx src/db/seed.ts (against the prod DB)
```

---

© Peregrine Goods Co. — Everything you carry, considered.
