# 🚀 Development & Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (optional)
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/thesurya46/Online-voting-system.git
cd Online-voting-system
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/voting_system

# Create database
creatdb voting_system

# Run migrations
npm run migrate

# Seed sample data
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Docker Deployment

### Using Docker Compose

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Manual Docker Build

```bash
# Backend
cd backend
docker build -t voting-backend:1.0 .
docker run -p 5000:5000 --env-file .env voting-backend:1.0

# Frontend
cd frontend
docker build -t voting-frontend:1.0 .
docker run -p 5173:5173 voting-frontend:1.0
```

## Production Deployment

### Environment Variables

Create `.env.production` with:

```
NODE_ENV=production
PORT=5000

# Database (use managed service like AWS RDS)
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/voting_prod

# JWT Secrets (strong, random values)
JWT_ACCESS_SECRET=your_very_long_random_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_very_long_random_secret_key_min_32_chars

# Email (SendGrid or similar)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key

# CORS
CORS_ORIGIN=https://votingsystem.com

# Redis (for caching/sessions)
REDIS_URL=redis://cache-server:6379
```

### Deployment Checklist

- [ ] Update all environment variables
- [ ] Configure HTTPS/SSL certificate
- [ ] Setup CDN for static assets
- [ ] Configure database backups
- [ ] Setup monitoring & logging
- [ ] Configure CI/CD pipeline
- [ ] Run security audit
- [ ] Load testing
- [ ] Setup error tracking (Sentry)
- [ ] Configure alerting

### AWS Deployment

```bash
# Build Docker images
docker build -t voting-backend:latest ./backend
docker build -t voting-frontend:latest ./frontend

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

docker tag voting-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/voting-backend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/voting-backend:latest

# Deploy using ECS/EKS or Elastic Beanstalk
```

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create voting-system-app

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_ACCESS_SECRET=your_secret

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
```

### Vercel Deployment (Frontend)

```bash
# Connect GitHub repository
vercel

# Set environment variables in Vercel dashboard
# VITE_API_URL=https://api.votingsystem.com
```

## Testing

### Backend Tests

```bash
cd backend

# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Monitoring & Logging

### Backend Logging

```bash
# View logs
docker-compose logs backend

# Follow logs
docker-compose logs -f backend

# Logs from specific time
docker-compose logs --since 1h backend
```

### Error Tracking

```typescript
// Configure Sentry (optional)
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Performance Optimization

### Backend
- Enable query result caching with Redis
- Use database connection pooling
- Implement rate limiting
- Compress responses with gzip
- Use CDN for file uploads

### Frontend
- Code splitting with Vite
- Lazy loading of components
- Image optimization
- CSS minification
- JavaScript minification

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml with load balancer
version: '3.8'
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend1
      - backend2
      - backend3

  backend1:
    # ... backend service

  backend2:
    # ... backend service

  backend3:
    # ... backend service
```

### Vertical Scaling

- Increase server RAM
- Upgrade CPU
- Optimize database queries
- Cache frequently accessed data

## Backup & Recovery

```bash
# Backup PostgreSQL
pg_dump voting_system > backup.sql

# Restore from backup
psql voting_system < backup.sql

# Automated backup (cron)
0 2 * * * pg_dump voting_system | gzip > /backups/voting_system_$(date +%Y%m%d).sql.gz
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check migrations
ps prisma migrate status

# Reset database (development only)
npm run migrate:reset
```

### API Not Responding

```bash
# Check health endpoint
curl http://localhost:5000/health

# View server logs
docker-compose logs backend

# Restart service
docker-compose restart backend
```

### CORS Issues

```typescript
// Update CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
```
