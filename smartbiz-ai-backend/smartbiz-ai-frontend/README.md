# SmartBiz AI — Frontend

React (Vite) + Tailwind CSS frontend for SmartBiz AI.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your running backend
npm run dev             # runs on http://localhost:5173
```

## Build for production

```bash
npm run build       # outputs to dist/
npm run preview      # preview the production build locally
```

## Environment variables

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Point this at your deployed backend URL in production (e.g. Render).

## Notes

- Requires the backend (see `../backend`) running and reachable at `VITE_API_BASE_URL`.
- `vercel.json` is included so client-side routing works correctly when deployed to Vercel (prevents 404 on refresh for routes like `/dashboard`).
