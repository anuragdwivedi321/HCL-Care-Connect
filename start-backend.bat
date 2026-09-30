@echo off
title CareConnect EHR - Backend Server (Spring Boot)
color 0B
echo ===================================================
echo   Starting CareConnect EHR Backend (Spring Boot)
echo   Listening on http://localhost:8085
echo   Swagger UI: http://localhost:8085/swagger-ui.html
echo ===================================================
cd /d "%~dp0backend"
call .\mvnw.cmd spring-boot:run
pause
