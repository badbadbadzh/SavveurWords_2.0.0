@echo off
cd /d "%~dp0"
if exist "%~dp0runtime\node.exe" (
  "%~dp0runtime\node.exe" "%~dp0scripts\start.cjs" --open
) else (
  where node >nul 2>nul
  if errorlevel 1 (
    echo Please install Node.js 22 or newer from https://nodejs.org/
    pause
    exit /b 1
  )
  node "%~dp0scripts\start.cjs" --open
)
if errorlevel 1 pause
