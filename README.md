# AI-Powered Multimodal Construction Intelligence Platform

> **A full-stack decision-support system** for construction professionals — powered by React.js, FastAPI, and Google Gemini multimodal AI.

---

## 🚀 Quick Start

### One-Command Launch (Windows)
Double-click **`start.bat`** — opens both servers automatically.

### Manual Start

**Terminal 1 — Backend (FastAPI)**
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 — Frontend (React + Vite)**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🧠 AI Modules (8 Epics)

| Module | Feature | Status |
|--------|---------|--------|
| 🛡 Safety Monitor | OSHA-compliant PPE & hazard detection via multimodal image analysis | ✅ |
| 🪨 Crack Analysis | Forensic crack classification, severity & repair methodology | ✅ |
| 🧮 Cost Estimator | Bill of Quantities (BOQ), materials, labor & cost benchmarking | ✅ |
| 📅 Project Planner | WBS, CPM critical path scheduling, milestones | ✅ |
| 🏠 Valuation | Multi-approach real estate appraisal with comparable sales | ✅ |
| 📋 Site Assistant | Daily shift logger → structured audit-ready reports | ✅ |
| 🌤 Weather Advisory | Engineering-grade activity impact from weather parameters | ✅ |
| 📚 Knowledge AI | ACI/OSHA/IS code Q&A with field checklists | ✅ |

---

## 🔑 AI API Key Setup (Optional — Enables Live Gemini AI)

1. Copy `backend/.env.example` → `backend/.env`
2. Add your **Google Gemini API key**:
```env
GEMINI_API_KEY=your_key_here
DEFAULT_MODEL=gemini-2.5-flash
```

> **Without a key:** The platform operates in **Analytical Mode** — high-fidelity civil engineering domain engine provides accurate results for all 8 modules using built-in algorithms.

---

## 🏗 Project Structure

```
smartbridge project/
├── backend/                  # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py           # App entry point + CORS
│   │   ├── config.py         # Settings & environment
│   │   ├── routers/          # 8 API endpoint modules
│   │   ├── schemas/          # Pydantic JSON contracts
│   │   └── services/         # AI + domain engine services
│   ├── tests/                # 14 pytest tests (all passing)
│   ├── .env                  # Environment variables
│   ├── requirements.txt
│   └── run.py
│
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx           # Shell + navigation + routing
│   │   ├── components/       # 8 page components + shared UI
│   │   └── services/api.js   # FastAPI integration layer
│   ├── public/
│   │   └── sample_images/    # SVG demo images
│   ├── index.html
│   └── vite.config.js
│
├── start.bat                 # One-click Windows launcher
└── README.md
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4, Lucide React |
| Backend | Python 3.14, FastAPI, Uvicorn, Pydantic v2 |
| AI / LLM | Google Gemini 2.5 Flash (Multimodal) |
| API Layer | REST JSON, FastAPI routers, multipart form support |
| Testing | pytest + pytest-asyncio, HTTPX, 14 tests |

---

## 📡 API Endpoints

```
POST /api/v1/safety/analyze         — Site safety + PPE analysis
POST /api/v1/crack/analyze          — Structural crack diagnostics
POST /api/v1/estimation/boq         — Bill of Quantities generation
POST /api/v1/planning/schedule      — CPM project schedule
POST /api/v1/valuation/evaluate     — Property valuation
POST /api/v1/site/daily-log         — Daily site report
POST /api/v1/weather/advisory       — Weather impact advisory
POST /api/v1/knowledge/query        — Engineering knowledge Q&A

GET  /                              — Platform health check
GET  /health                        — Module status
GET  /docs                          — Swagger interactive API docs
```

---

## ✅ Tests

```bash
cd backend
python -m pytest tests/ -v
# 14 passed ✅
```


---

## 🚀 Deployment (Render / Docker)

### Deploy on Render

1. Push this project to a GitHub repository. **Do not commit `backend/.env` or any API key.** The repository includes a `.gitignore` to help prevent this.
2. In Render, choose **New → Blueprint** and connect the repository. Render reads `render.yaml` and builds the root `Dockerfile`.
3. In the service's Environment settings, set `GEMINI_API_KEY` to your own Google AI Studio key (optional; the analytical fallback works without it).
4. Wait for the deploy to finish, then open the service URL. The UI and API share the same origin; `/health` is the health check and `/docs` shows the API docs.

The Render free plan may sleep when idle and cold-start on the next visit. Change the plan in `render.yaml` if you need always-on service.

### Run locally with Docker

```bash
docker build -t smartbridge .
docker run --rm -p 8000:8000 -e GEMINI_API_KEY="your_key_here" smartbridge
```

Open `http://localhost:8000`. The key is optional and should be provided through environment variables, never committed to source control.

### Run locally without Docker

Backend (from `backend/`):
```bash
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Frontend (from `frontend/`, in another terminal):
```bash
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to the local backend.
