@echo off
title CareConnect EHR - Frontend Application (Angular)
color 0A
echo ===================================================
echo   Starting CareConnect EHR Frontend (Angular)
echo   Listening on http://localhost:4200
echo ===================================================
cd /d "%~dp0frontend"
call npx ng serve --host 0.0.0.0 --port 4200
pause
