#!/bin/bash

# Prime Steel Employee Verification System - Startup Script
# This script will set up and start the application

echo "🚀 Starting Prime Steel Employee Verification System..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Navigate to script directory
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please make sure you're in the correct directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies."
        exit 1
    fi
else
    echo "✅ Dependencies already installed."
fi

# Create db directory if it doesn't exist
if [ ! -d "db" ]; then
    echo "🗄️ Creating database directory..."
    mkdir -p db
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client."
    exit 1
fi

# Push database schema
echo "💾 Pushing database schema..."
npm run db:push
if [ $? -ne 0 ]; then
    echo "❌ Failed to push database schema."
    exit 1
fi

# Check if we need to seed the database
if [ ! -f "db/custom.db" ] || [ "$1" == "--reset" ]; then
    echo "🌱 Seeding database..."
    npm run db:seed
    if [ $? -ne 0 ]; then
        echo "❌ Failed to seed database."
        exit 1
    fi
else
    echo "✅ Database already seeded."
fi

echo ""
echo "🎯 Starting development server..."
echo "📍 Application will be available at: http://localhost:3000"
echo "🔐 Default login: username 'admin', password 'password'"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev