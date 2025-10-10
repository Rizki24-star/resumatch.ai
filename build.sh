#!/bin/bash
set -e

# Build backend
echo "Building backend..."
cd backend
npm install --legacy-peer-deps
npm run build
cd ..

# Build frontend
echo "Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

# Copy Nuxt output to root
echo "Copying output..."
if [ -d "frontend/.vercel/output" ]; then
  cp -r frontend/.vercel/output .vercel/
  echo "Output copied successfully"
else
  echo "Error: frontend/.vercel/output not found"
  exit 1
fi
