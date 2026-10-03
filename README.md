# Atlas

Atlas is a portfolio and market simulator designed to run as a web app, mobile app, and backend service with a shared product flow.

## Projects

- `apps/web` — Next.js website for market and portfolio management
- `apps/mobile` — Expo React Native app for mobile use
- `apps/server` — Express + Prisma backend service

## Quick start

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Environment

Create environment files as needed:

- `apps/server/.env` with `DATABASE_URL="file:./dev.db"`

## Stack

- Frontend: Next.js + React
- Mobile: Expo + React Native
- Backend: Express + Prisma + SQLite (local development)

## Features

- Market dashboard with stock and crypto assets
- Portfolio tracking and trade simulation
- Custom asset creation
- Persistent settings and local data
- REST API foundation for web and mobile clients
