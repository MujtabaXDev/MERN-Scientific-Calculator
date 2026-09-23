#!/bin/bash

# Build production images
docker-compose build

# Start services
docker-compose up -d

echo "🚀 MERN Calculator is running!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:5000"
echo "MongoDB: mongodb://127.0.0.1:27017"
