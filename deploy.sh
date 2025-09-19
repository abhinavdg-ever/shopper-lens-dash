#!/bin/bash

# Shopper Lens Dashboard - VPS Deployment Script

echo "🚀 Starting deployment of Shopper Lens Dashboard..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start new containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Check if containers are running
echo "✅ Checking container status..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo "🎉 Deployment complete!"
echo "🌐 Your application should be available at: http://your-vps-ip"
echo "📁 Video files are served from: /usr/share/nginx/html/"

# Optional: Show how to update videos
echo ""
echo "📝 To update video files:"
echo "1. Replace files in ./public/ directory"
echo "2. Run: docker-compose up --build -d"
