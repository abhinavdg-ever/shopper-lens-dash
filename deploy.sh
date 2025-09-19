#!/bin/bash

# Shopper Lens Dashboard - Docker VPS Deployment Script

echo "🚀 Starting Docker deployment of Shopper Lens Dashboard..."

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

# Check if video files exist
if [ ! -f "public/Original Video.mp4" ] || [ ! -f "public/Processed Video.mp4" ]; then
    echo "⚠️  Video files not found in public/ directory!"
    echo "   Please upload the following files to public/ directory:"
    echo "   - Original Video.mp4"
    echo "   - Processed Video.mp4"
    echo ""
    echo "   You can upload them via SCP:"
    echo "   scp 'Original Video.mp4' user@72.60.96.212:~/shopper-lens-dash/public/"
    echo "   scp 'Processed Video.mp4' user@72.60.96.212:~/shopper-lens-dash/public/"
    echo ""
    read -p "Press Enter to continue after uploading videos..."
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
echo "🌐 Your application is available at: http://72.60.96.212:3005"
echo "📹 Videos are available at:"
echo "   - http://72.60.96.212:3005/Original%20Video.mp4"
echo "   - http://72.60.96.212:3005/Processed%20Video.mp4"

# Optional: Show how to update videos
echo ""
echo "📝 To update video files:"
echo "1. Replace files in ./public/ directory"
echo "2. Run: docker-compose up --build -d"
