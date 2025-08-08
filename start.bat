@echo off
echo Starting TechInterns Website Server...
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting the server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm start