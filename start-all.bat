@echo off
title CareConnect EHR - Launcher
color 0E
echo ===================================================
echo   Launching CareConnect EHR System
echo   1. Starting Backend (Port 8085)
echo   2. Starting Frontend (Port 4200)
echo ===================================================

start "CareConnect Backend" cmd /k "%~dp0start-backend.bat"
timeout /t 5 /nobreak >nul
start "CareConnect Frontend" cmd /k "%~dp0start-frontend.bat"
timeout /t 8 /nobreak >nul
start http://localhost:4200
echo Both servers started!
