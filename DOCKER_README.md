# Agile Project Platform - Docker Deployment Guide

This document explains how to deploy the Agile Project Platform using Docker.

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB available memory

### One-Click Deployment
```bash
# Clone project (if not already done)
git clone <repository-url>
cd agile-project-platform

# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

### Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432 (PostgreSQL)
- **Redis**: localhost:6379

## Service Architecture

### Service List
| Service | Port | Description |
|---------|------|-------------|
| frontend | 8080 | React frontend app (Nginx) |
| backend | 3000 | Node.js API service |
| postgres | 5432 | PostgreSQL database |
| redis | 6379 | Redis cache service |

### Network Architecture
```
Internet → Nginx (Frontend) → Backend API → PostgreSQL/Redis
```

## Development Mode

### Start Development Environment
```bash
# Start with development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Development Configuration File
Create `docker-compose.dev.yml`:
```yaml
version: '3.8'

services:
  backend:
    build:
      target: development
    volumes:
      - ./backend/src:/app/src
    environment:
      NODE_ENV: development
    command: npm run dev

  frontend:
    build:
      target: development
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
    ports:
      - "5173:5173"
    environment:
      NODE_ENV: development
```

## Common Commands

### Basic Operations
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# View logs
docker-compose logs -f [service-name]

# Enter container
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Data Management
```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres agile_platform > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres agile_platform < backup.sql

# Clean data (use with caution)
docker-compose down -v
```

## Environment Variable Configuration

### Production Environment Configuration
Create `.env` file:
```bash
# Database configuration
POSTGRES_DB=agile_platform
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# JWT configuration
JWT_SECRET=your-super-secure-jwt-secret-key

# Application configuration
NODE_ENV=production
PORT=3000
```

### Update docker-compose.yml
```yaml
services:
  backend:
    env_file:
      - .env
```

## Monitoring and Logging

### Check Service Status
```bash
# All services status
docker-compose ps

# Resource usage
docker stats

# Health check
docker-compose exec backend curl http://localhost:3000/health
```

### Log Management
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Real-time log tracking
docker-compose logs -f --tail=100
```

## Performance Optimization

### Production Environment Optimization
```yaml
# Add to docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    restart: unless-stopped

  frontend:
    deploy:
      resources:
        limits:
          memory: 128M
```

### Database Optimization
```yaml
services:
  postgres:
    environment:
      POSTGRES_SHARED_PRELOAD_LIBRARIES: pg_stat_statements
    command: >
      postgres
      -c shared_preload_libraries=pg_stat_statements
      -c max_connections=100
      -c shared_buffers=256MB
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :80
   # Or modify port mapping in docker-compose.yml
   ```

2. **Permission Issues**
   ```bash
   # Ensure Docker has sufficient permissions
   sudo chown -R $USER:$USER .
   ```

3. **Memory Issues**
   ```bash
   # Increase Docker memory limit
   # Or use lighter images
   ```

4. **Database Connection Failures**
   ```bash
   # Check network connection
   docker-compose exec backend ping postgres
   
   # View database logs
   docker-compose logs postgres
   ```

### Reset Environment
```bash
# Complete reset (will delete all data)
docker-compose down -v
docker system prune -f
docker-compose up --build -d
```

## Image Management

### Build Custom Images
```bash
# Build backend image
docker build -t agile-platform/backend ./backend

# Build frontend image
docker build -t agile-platform/frontend ./frontend

# Push to registry
docker push agile-platform/backend
docker push agile-platform/frontend
```

### Multi-stage Builds
The project uses multi-stage builds to optimize image size:
- **Backend**: Node.js → Build → Production
- **Frontend**: Node.js → Build → Nginx

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to Docker
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Docker
        run: |
          docker-compose up -d --build
```

## Additional Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [React Docker Deployment](https://vitejs.dev/guide/static-deploy.html)
