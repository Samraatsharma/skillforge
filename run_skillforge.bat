@echo off
setlocal

echo ==========================================
echo   SKILLFORGE AI - CYBERPUNK LAUNCHER
echo ==========================================
echo.
cd /d "%~dp0"

echo [1/4] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies found.
)

echo.
echo [2/4] Building application...
call npm run build

echo.
echo [3/4] Launching browser...
timeout /t 2 >nul
start http://localhost:3000

echo.
echo [4/4] Starting server...
echo Press Ctrl+C to stop the server.
call npm start
