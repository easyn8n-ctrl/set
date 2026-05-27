@echo off
chcp 65001 >nul
title WebCraft - Reset Database
color 0E

echo.
echo  WARNING: This will delete ALL data in the database!
echo.
set /p confirm="  Type YES to continue: "
if /i not "%confirm%"=="YES" (
    echo  Operation cancelled.
    pause
    exit /b 0
)

echo.
echo  Resetting database...

:: Remove existing database
if exist "db" (
    rmdir /s /q db
)

:: Create fresh database
mkdir db
call npx prisma db push

:: Seed admin
call npx prisma db execute --schema prisma/schema.prisma --stdin < seed-admin.sql 2>nul

echo.
echo  Database reset complete!
echo  Admin: admin@webcraft.ca / admin123
echo.
pause
