# Zeerostock Developer Assignment

This repository contains complete solutions for both Part A and Part B of the Zeerostock developer assignment.

---

## Part A — Inventory Search API + UI

**Stack:** Node.js + Express (backend) · React + Vite (frontend)

### Quick start

```bash
# Backend (port 5000)
cd part-a/backend && npm install && npm start

# Frontend (port 3000) — in a new terminal
cd part-a/frontend && npm install && npm run dev
```

**Key endpoints:**
- `GET /search?q=chair&category=Furniture&minPrice=50&maxPrice=300`
- `GET /categories`

See `part-a/README.md` for full details.

---

## Part B — Inventory Database + APIs

**Stack:** Node.js + Express · SQLite (better-sqlite3)

### Quick start

```bash
cd part-b && npm install && npm start
# Server runs on port 5001
# SQLite DB is auto-created on first run
```

**Key endpoints:**
- `POST /supplier`
- `POST /inventory`
- `GET /inventory`
- `GET /inventory/grouped`

See `part-b/README.md` for full API reference and schema explanation.

---

## Repository Structure

```
zeerostock-assignment/
├── part-a/
│   ├── backend/        ← Express search API
│   ├── frontend/       ← React + Vite UI
│   └── README.md
├── part-b/
│   ├── src/            ← Express + SQLite API
│   └── README.md
└── README.md           ← This file
```

## Submission Links

- **GitHub:** https://github.com/your-username/zeerostock-assignment
- **Frontend (Vercel):** https://your-frontend.vercel.app
- **Backend (Render):** https://your-backend.onrender.com
- **Screen Recording:** https://drive.google.com/your-link
