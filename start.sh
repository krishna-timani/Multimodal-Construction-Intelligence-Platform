#!/bin/bash
echo "============================================================"
echo " AI-Powered Multimodal Construction Intelligence Platform"
echo "============================================================"
echo ""

# Start Backend
echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000"
cd "$(dirname "$0")/backend"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!
echo "       Backend PID: $BACKEND_PID"

sleep 2

# Start Frontend
echo "[2/2] Starting React Frontend on http://localhost:5173"
cd "$(dirname "$0")/frontend"
npm run dev &
FRONTEND_PID=$!
echo "       Frontend PID: $FRONTEND_PID"

echo ""
echo "============================================================"
echo " Both servers running! Open: http://localhost:5173"
echo " Press Ctrl+C to stop all services."
echo "============================================================"

wait

