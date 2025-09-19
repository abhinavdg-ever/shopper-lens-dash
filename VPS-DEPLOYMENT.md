# 🚀 VPS Deployment Guide - Shopper Lens Dashboard

## 📁 Video File Locations

### For Development:
```
public/
├── Original Video.mp4
└── Processed Video.mp4
```

### For Production (VPS):
```
/usr/share/nginx/html/
├── Original Video.mp4
└── Processed Video.mp4
```

## 🐳 Docker Deployment

### Prerequisites:
- Docker installed on VPS
- Docker Compose installed on VPS
- Port 80 available

### Quick Deploy:
```bash
# Clone repository
git clone <your-repo-url>
cd shopper-lens-dash

# Make sure videos are in public/ folder
ls public/
# Should show: Original Video.mp4, Processed Video.mp4

# Deploy
./deploy.sh
```

### Manual Deploy:
```bash
# Build and start
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 📹 Video Management

### Adding New Videos:
1. **Place videos in `public/` folder**
2. **Update video sources in code** (if needed)
3. **Redeploy**: `docker-compose up --build -d`

### Video Requirements:
- **Format**: MP4 (recommended)
- **Codec**: H.264
- **Size**: Optimize for web (under 50MB recommended)
- **Resolution**: 1080p or 720p

## 🌐 Access Your Application

- **URL**: `http://your-vps-ip`
- **Port**: 80 (default)
- **HTTPS**: Configure SSL certificate for production

## 🔧 Configuration

### Nginx Configuration:
- **File**: `nginx.conf`
- **Caching**: Static assets cached for 1 year
- **Videos**: Cached for 1 day
- **CORS**: Enabled for video files

### Environment Variables:
- `NODE_ENV=production` (set automatically)

## 📊 Monitoring

### Check Container Health:
```bash
docker-compose ps
docker-compose logs
```

### Restart Application:
```bash
docker-compose restart
```

### Update Application:
```bash
git pull
docker-compose up --build -d
```

## 🛠️ Troubleshooting

### Videos Not Loading:
1. Check if videos are in `public/` folder
2. Verify file permissions
3. Check nginx logs: `docker-compose logs`

### Port Issues:
1. Ensure port 80 is available
2. Check firewall settings
3. Verify Docker is running

### Performance:
1. Optimize video file sizes
2. Enable gzip compression (already configured)
3. Use CDN for video delivery (optional)

## 🔒 Security

### Production Recommendations:
1. **SSL Certificate**: Use Let's Encrypt
2. **Firewall**: Configure UFW or iptables
3. **Updates**: Keep Docker and system updated
4. **Monitoring**: Set up log monitoring

### SSL Setup (Optional):
```bash
# Install certbot
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Update nginx.conf to use SSL
# Add SSL configuration to nginx.conf
```
