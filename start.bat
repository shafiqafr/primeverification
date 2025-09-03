@echo off
REM Prime Steel Employee Verification System - Startup Script for Windows
REM This script will set up and start the application

echo 🚀 Starting Prime Steel Employee Verification System...
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Navigate to script directory
cd /d "%~dp0"

echo 📁 Current directory: %CD%

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Please make sure you're in the correct directory.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies.
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencies already installed.
)

REM Create db directory if it doesn't exist
if not exist "db" (
    echo 🗄️ Creating database directory...
    mkdir db
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npm run db:generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma client.
    pause
    exit /b 1
)

REM Push database schema
echo 💾 Pushing database schema...
call npm run db:push
if errorlevel 1 (
    echo ❌ Failed to push database schema.
    pause
    exit /b 1
)

REM Check if we need to seed the database
if not exist "db\custom.db" (
    echo 🌱 Seeding database...
    call npm run db:seed
    if errorlevel 1 (
        echo ❌ Failed to seed database.
        pause
        exit /b 1
    )
) else (
    echo ✅ Database already seeded.
)

echo.
echo 🎯 Starting development server...
echo 📍 Application will be available at: http://localhost:3000
echo 🔐 Default login: username 'admin', password 'password'
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
call npm run dev

pause