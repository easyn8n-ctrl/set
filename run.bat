@echo off
chcp 65001 >nul
title WebCraft - Professional Websites
color 0A

:: Handle command line arguments
if "%1"=="" goto :menu
if /i "%1"=="dev" goto :dev
if /i "%1"=="prod" goto :prod
if /i "%1"=="build" goto :build
if /i "%1"=="setup" goto :setup
if /i "%1"=="stop" goto :stop
goto :menu

:menu
echo.
echo  ========================================================
echo  ║                                                      ║
echo  ║              WebCraft - Control Panel                ║
echo  ║                                                      ║
echo  ========================================================
echo.
echo   [1] Start Development Server   (http://localhost:3000)
echo   [2] Build for Production
echo   [3] Start Production Server    (http://localhost:3000)
echo   [4] Run Setup                  (first time only)
echo   [5] Stop Server
echo   [6] Open in Browser
echo   [7] Exit
echo.
set /p choice="  Choose an option (1-7): "

if "%choice%"=="1" goto :dev
if "%choice%"=="2" goto :build
if "%choice%"=="3" goto :prod
if "%choice%"=="4" goto :setup
if "%choice%"=="5" goto :stop
if "%choice%"=="6" goto :browser
if "%choice%"=="7" exit /b 0
goto :menu

:dev
echo.
echo  Starting WebCraft Development Server...
echo  Opening http://localhost:3000 ...
echo.
echo  Press Ctrl+C to stop the server
echo.
call npx next dev -p 3000
goto :menu

:build
echo.
echo  Building WebCraft for production...
echo  This may take a few minutes...
echo.
call npx next build
if %errorlevel% neq 0 (
    echo.
    echo  Build failed! Check the errors above.
    pause
    goto :menu
)
echo.
echo  Build complete!
echo.
pause
goto :menu

:prod
echo.
echo  Starting WebCraft Production Server...
echo  Opening http://localhost:3000 ...
echo.
echo  Press Ctrl+C to stop the server
echo.
set NODE_ENV=production
call node .next\standalone\server.js
goto :menu

:setup
call setup.bat
goto :menu

:stop
echo  Stopping any running Node.js servers...
taskkill /f /im node.exe 2>nul
echo  Done.
timeout /t 2 /nobreak >nul
goto :menu

:browser
echo  Opening http://localhost:3000 in your browser...
start http://localhost:3000
goto :menu
