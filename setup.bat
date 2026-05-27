@echo off
chcp 65001 >nul
title WebCraft Setup - Windows 64-bit
color 0A

echo.
echo  ========================================================
echo  ║                                                      ║
echo  ║              WebCraft - Windows Setup                ║
echo  ║         Professional Websites for Businesses         ║
echo  ║                                                      ║
echo  ========================================================
echo.

:: Check Node.js
echo [1/6] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: Node.js is not installed!
    echo.
    echo  Please download and install Node.js v18+ from:
    echo  https://nodejs.org/en/download/
    echo.
    echo  Choose the "Windows Installer (.msi)" 64-bit version
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo  Node.js %NODE_VER% found - OK
echo.

:: Check npm
echo [2/6] Checking npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo  ERROR: npm not found! Please reinstall Node.js.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
echo  npm %NPM_VER% found - OK
echo.

:: Install dependencies
echo [3/6] Installing dependencies...
echo  This may take a few minutes on first run...
echo.
call npm install
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: Failed to install dependencies!
    echo  Try running: npm install --legacy-peer-deps
    pause
    exit /b 1
)
echo.
echo  Dependencies installed - OK
echo.

:: Generate Prisma client
echo [4/6] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo  ERROR: Prisma client generation failed!
    pause
    exit /b 1
)
echo  Prisma client generated - OK
echo.

:: Create database directory
echo [5/6] Setting up database...
if not exist "db" mkdir db

:: Push database schema
call npx prisma db push
if %errorlevel% neq 0 (
    echo  ERROR: Database setup failed!
    pause
    exit /b 1
)
echo  Database created - OK
echo.

:: Create admin account
echo [6/6] Seeding admin account...
call npx prisma db execute --schema prisma/schema.prisma --stdin < seed-admin.sql 2>nul
if %errorlevel% neq 0 (
    echo  Creating admin via API...
    timeout /t 3 /nobreak >nul
    start /b cmd /c "node -e ""const http=require('http');http.get('http://localhost:3000/api/admin/seed',r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>console.log(d))})"""
)
echo.

echo.
echo  ========================================================
echo  ║                                                      ║
echo  ║              Setup Complete!                         ║
echo  ║                                                      ║
echo  ========================================================
echo.
echo  To start the website:
echo.
echo    Development:  run.bat dev
echo    Production:   run.bat prod
echo.
echo  Then open: http://localhost:3000
echo.
echo  Admin Login:
echo    Email:    admin@webcraft.ca
echo    Password: admin123
echo.
echo  Google OAuth:
echo    Add your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
echo    in the .env file for Google sign-in
echo.
echo ========================================================
echo.
pause
