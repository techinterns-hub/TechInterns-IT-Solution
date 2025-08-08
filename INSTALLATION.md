# Quick Installation Guide

## Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation Steps

### Option 1: Quick Start (Windows)
1. Double-click `start.bat` file
2. Wait for dependencies to install
3. Server will start automatically on http://localhost:3000

### Option 2: Manual Installation
1. Open command prompt in the project directory
2. Run: `npm install`
3. Run: `npm start`
4. Open browser and go to http://localhost:3000

## Accessing the Admin Panel
1. Navigate to http://localhost:3000/admin-login.html
2. Use admin credentials to login
3. Make changes to courses, pricing, or internships
4. Changes will persist across browser sessions and different systems

## Verification
- Open the website in multiple browsers/systems
- Make changes in the admin panel
- Verify changes appear everywhere immediately
- Restart the server and confirm data persists

## Troubleshooting
- If port 3000 is busy, the server will show an error
- Check if Node.js is properly installed: `node --version`
- Ensure all dependencies are installed: `npm install`