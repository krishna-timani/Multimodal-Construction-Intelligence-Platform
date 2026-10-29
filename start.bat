@echo off
echo ============================================================
echo  AI-Powered Multimodal Construction Intelligence Platform
echo ============================================================
echo.
echo  [1/2] Starting FastAPI Backend on http://127.0.0.1:8000
echo        API Docs available at: http://127.0.0.1:8000/docs
echo.
cd /d "%~dp0backend"
start "ConstructionAI Backend" cmd /k "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo  [2/2] Starting React Frontend on http://localhost:5173
echo.
cd /d "%~dp0frontend"
start "ConstructionAI Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo  ============================================================
echo   Both servers are now running!
echo   Open your browser to: http://localhost:5173
echo  ============================================================
echo.
pause

