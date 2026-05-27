@echo off
chcp 65001 >nul
title WebCraft - Build for Production
color 0B

echo.
echo  Building WebCraft for production...
echo  This creates an optimized version for best performance.
echo.

:: Build
call npx next build
if %errorlevel% neq 0 (
    echo.
    echo  Build failed! Check the errors above.
    pause
    exit /b 1
)

:: Copy static files for standalone
echo.
echo  Copying static files...
xcopy /E /I /Y .next\static .next\standalone\.next\static >nul 2>nul
xcopy /E /I /Y public .next\standalone\public >nul 2>nul

echo.
echo  ========================================================
echo  ║                                                      ║
echo  ║              Build Complete!                         ║
echo  ║                                                      ║
echo  ========================================================
echo.
echo  To run the production server:
echo    run.bat prod
echo  OR:
echo    set NODE_ENV=production
echo    node .next\standalone\server.js
echo.
echo  The production server will be available at:
echo    http://localhost:3000
echo.
pause
