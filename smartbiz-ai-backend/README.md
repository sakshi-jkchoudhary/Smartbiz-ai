# SmartBiz AI — Backend

Node.js + Express + MongoDB API for SmartBiz AI.

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run seed            # optional: populates demo data
npm run dev             # runs on http://localhost:5000
```

## Environment variables

See `.env.example`. You need:
- A MongoDB Atlas connection string (`MONGO_URI`)
- A JWT secret (`JWT_SECRET`) — generate with `openssl rand -base64 32`
- A Gemini API key (`GEMINI_API_KEY`) from https://aistudio.google.com/app/apikey

## Demo login (after running `npm run seed`)

```
Email:    demo@sharmastore.com
Password: demo1234
```

## Health check

```
GET /api/v1/health
```
