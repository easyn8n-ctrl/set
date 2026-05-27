@echo off
chcp 65001 >nul
title WebCraft - Production Server
color 0A

echo.
echo  Starting WebCraft Production Server...
echo.
echo  Server: http://localhost:3000
echo  Press Ctrl+C to stop
echo.

set NODE_ENV=production
set PORT=3000
set HOSTNAME=0.0.0.0

node .next\standalone\server.js
