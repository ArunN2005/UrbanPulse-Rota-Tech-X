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

# 1.5 Start Python Services in the background
echo "🐍 Starting Python Services..."
cd python_services
source venv/bin/activate
./venv/bin/python distilbert_emotion_service.py &
./venv/bin/python gradcam_service.py &
cd ../..

# 2. Wait 3 seconds so the backend logs don't mess up the Expo QR code drawing
sleep 3

# 3. Start the Frontend in the foreground (so you can see the QR code and interact)
echo -e "\n📱 Starting Expo Frontend..."
cd CIVIC-REZO-Frontend
npx expo start -c
