@echo off
echo Starting Home Frontend Development Environment
echo ==================================================
echo Note: Backend must be running separately from home-backend repository
echo.

echo Starting frontend server...
start cmd /k "npm run dev"

echo.
echo Servers starting up...
echo Frontend: http://localhost:8080 (or next available port)
echo Backend: Start from d:\home-backend directory
echo.
echo Press any key to exit...
pause > nul