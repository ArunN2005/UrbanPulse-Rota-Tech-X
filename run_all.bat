@echo off
echo ========================================================
echo        Starting CIVIC-REZO Application stack
echo ========================================================
echo.

:: Get the directory of this batch file
cd /d "%~dp0"

echo [1/2] Starting Backend Server (Node.js)...
start "CIVIC-REZO Backend" cmd /k "cd CIVIC-REZO-Backend && echo Starting Backend... && npm run dev"

:: Wait a brief moment to let backend start first
timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Server (Expo)...
start "CIVIC-REZO Frontend" cmd /k "cd CIVIC-REZO-Frontend && echo Starting Frontend... && npx expo start --clear"

echo.
echo ========================================================
echo  Both servers have been launched in separate windows!
echo  You can safely close this window.
echo ========================================================
timeout /t 5 > nul
