# 🏋️ Pleustradenn

A full-stack web app to track workout sessions, exercises, and progress — built with FastAPI + SQLModel backend and SvelteKit frontend.

![App preview](./screenshots.png)

---

## 🚀 Features

- User-authenticated workout tracker
- Exercise and session management
- Session history with detailed stats
- Responsive UI with SvelteKit
- SQLite-backed, dockerized backend

---

## 🧱 Structure

- `backend/`: FastAPI app with auth, models, and REST endpoints
- `frontend/`: SvelteKit frontend
- REST API under `/api`

---

## 📦 Deployment

### With Podman or Docker

```bash
podman run -d --replace \
	--name workouts \
	--network workouts-proxy \
	-v ./workouts:/data \
	-e ADMIN_USERNAME=${ADMIN_USERNAME} \
	-e ADMIN_PASSWORD=${ADMIN_PASSWORD} \
	ghcr.io/mathieumoalic/workouts:latest
```

---

### 🔁 Reverse Proxy (Caddy)

```Caddyfile
workouts.example.com {
	reverse_proxy localhost:6001
}
```

---

## ⚙️ Tech Stack

- **Backend**: Python, FastAPI, SQLModel
- **Frontend**: SvelteKit, TailwindCSS
- **Auth**: JWT, passlib
- **DB**: SQLite (default), easily swappable
- **Containerized**: Podman/Docker support

---

## 🧪 Development

Clone, then run:

```bash
# Backend (requires Python 3.12+)
cd backend
uvicorn main:app --reload

# Frontend
cd src
npm install
npm run dev
```
