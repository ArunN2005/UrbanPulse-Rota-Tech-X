#!/bin/bash

echo "================================================"
echo "🚀 Starting CIVIC-REZO Hackathon App..."
echo "================================================"

# This ensures that when you press Ctrl+C to stop Expo, 
# it also kills the background backend process
trap "echo -e '\n🛑 Shutting down services...'; kill 0" EXIT

# 1. Start the Backend in the background
echo "📦 Starting Backend Server..."
cd CIVIC-REZO-Backend
npm run dev &
cd ..

# 2. Wait 3 seconds so the backend logs don't mess up the Expo QR code drawing
sleep 3

# 3. Start the Frontend in the foreground (so you can see the QR code and interact)
echo -e "\n📱 Starting Expo Frontend..."
cd CIVIC-REZO-Frontend
npx expo start -c
