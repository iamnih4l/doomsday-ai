# Backend implementation (Option A – Next.js API routes)

Backend lives **inside this repo** as Next.js API routes. No separate server.

## Current setup

- **Single catch-all route:** `app/api/[[...path]]/route.js` handles all `/api/*` and returns mock data.
- **Frontend:** Calls `fetch('/api/clock')`, `fetch('/api/risk-breakdown')`, etc. No changes needed when you add real logic.

## Option A: Enhance the existing routes

1. **Keep the same URLs and response shapes**  
   Contract is in [API.md](./API.md). Responses must match those shapes so the frontend keeps working.

2. **Where to add real logic**
   - **Option A1 – Stay in one file:** Replace the mock objects in `app/api/[[...path]]/route.js` with calls to a DB or external APIs, then return the same JSON shapes.
   - **Option A2 – Split routes (recommended as it grows):** Add one file per endpoint and delete the catch-all (or keep it only for a simple `/api` info response):
     - `app/api/clock/route.js`
     - `app/api/risk-breakdown/route.js`
     - `app/api/explanations/route.js`
     - `app/api/timeline/route.js`
     - `app/api/map-data/route.js`  
     Each exports `GET` and returns the structure from API.md.

3. **Database**  
   - **MongoDB** is already in `package.json`. Use it for clock state, risk domains, explanations, timeline events, and regions.
   - Suggested collections (or equivalent): `clock`, `risk_domains`, `explanations`, `timeline_events`, `regions`.
   - Use env vars for connection string, e.g. `MONGODB_URI`, in `.env.local`.

4. **Environment**
   - `.env.local`: `MONGODB_URI`, any API keys for external risk/data sources.
   - Do not commit `.env.local`; document required vars in this file or a README.

5. **Deployment**  
   One Next.js app: frontend and API deploy together (Vercel, Node server, etc.). No separate backend service.

## Quick checklist for implementation

- [ ] Add MongoDB (or other DB) connection helper (e.g. `lib/db.js`).
- [ ] Implement each endpoint so responses match [API.md](./API.md).
- [ ] Move secrets to `.env.local` and document them.
- [ ] (Optional) Split `app/api/[[...path]]/route.js` into per-endpoint route files.
- [ ] Remove or replace mock data once real data is wired.
