# 🚀 Deployment Guide

This guide covers deploying the Quiz Platform backend to production.

## 📋 Pre-deployment Checklist

- [ ] Update `.env` with production values
- [ ] Set strong JWT_SECRET
- [ ] Configure production database
- [ ] Set up Telegram bot (optional)
- [ ] Review CORS settings
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups

## 🔐 Environment Variables

Create a `.env.production` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/quiz_platform?schema=public"

# JWT
JWT_SECRET="your-super-secret-production-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Telegram (optional)
TELEGRAM_BOT_TOKEN="your-production-bot-token"

# Server
PORT=3000
NODE_ENV="production"
```

## 🐳 Docker Deployment

### Option 1: Docker Compose (Recommended)

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: quiz-postgres-prod
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: quiz_platform
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - quiz-network

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: quiz-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/quiz_platform?schema=public
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      PORT: 3000
      NODE_ENV: production
    depends_on:
      - postgres
    networks:
      - quiz-network

volumes:
  postgres_data:

networks:
  quiz-network:
    driver: bridge
```

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run prisma:generate
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
```

Deploy:

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

## ☁️ Cloud Platform Deployments

### Heroku

1. **Create Heroku app**
```bash
heroku create quiz-platform-api
```

2. **Add PostgreSQL addon**
```bash
heroku addons:create heroku-postgresql:mini
```

3. **Set environment variables**
```bash
heroku config:set JWT_SECRET="your-secret"
heroku config:set JWT_EXPIRES_IN="7d"
heroku config:set TELEGRAM_BOT_TOKEN="your-token"
```

4. **Create Procfile**
```
web: npm run start:prod
release: npx prisma migrate deploy
```

5. **Deploy**
```bash
git push heroku main
```

### Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and init**
```bash
railway login
railway init
```

3. **Add PostgreSQL**
```bash
railway add postgresql
```

4. **Set environment variables**
```bash
railway variables set JWT_SECRET="your-secret"
railway variables set JWT_EXPIRES_IN="7d"
```

5. **Deploy**
```bash
railway up
```

### DigitalOcean App Platform

1. Create new app from GitHub repo
2. Add PostgreSQL database
3. Set environment variables in dashboard
4. Configure build command: `npm run build`
5. Configure run command: `npm run start:prod`
6. Deploy

### AWS (EC2)

1. **Launch EC2 instance** (Ubuntu 22.04)

2. **Install dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2
```

3. **Setup PostgreSQL**
```bash
sudo -u postgres psql
CREATE DATABASE quiz_platform;
CREATE USER quizuser WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE quiz_platform TO quizuser;
\q
```

4. **Clone and setup app**
```bash
git clone <your-repo>
cd test-quiz-nestjs
npm install --legacy-peer-deps
npm run prisma:generate
npm run build
```

5. **Configure environment**
```bash
cp .env.example .env
nano .env  # Edit with production values
```

6. **Run migrations**
```bash
npm run prisma:migrate
```

7. **Start with PM2**
```bash
pm2 start dist/main.js --name quiz-api
pm2 save
pm2 startup
```

8. **Setup Nginx reverse proxy**
```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/quiz-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/quiz-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **Setup SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔒 Security Hardening

### 1. Environment Variables
Never commit `.env` files. Use secrets management:
- AWS Secrets Manager
- HashiCorp Vault
- Environment variables in hosting platform

### 2. Database Security
```bash
# Use SSL for database connections
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### 3. Rate Limiting
Add to `main.ts`:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### 4. Helmet for Security Headers
```bash
npm install helmet
```

Add to `main.ts`:
```typescript
import helmet from 'helmet';
app.use(helmet());
```

### 5. CORS Configuration
Update `main.ts`:
```typescript
app.enableCors({
  origin: ['https://your-frontend.com'],
  credentials: true,
});
```

## 📊 Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs quiz-api
```

### Health Check Endpoint
Add to `app.controller.ts`:
```typescript
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date() };
}
```

### Logging
Install Winston:
```bash
npm install winston nest-winston
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install --legacy-peer-deps
    
    - name: Generate Prisma Client
      run: npm run prisma:generate
    
    - name: Build
      run: npm run build
    
    - name: Run tests
      run: npm test
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/app
          git pull
          npm install --legacy-peer-deps
          npm run prisma:generate
          npm run build
          npm run prisma:migrate
          pm2 restart quiz-api
```

## 📦 Database Backups

### Automated Backups (Cron)

```bash
# Create backup script
cat > /home/user/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"
mkdir -p $BACKUP_DIR
pg_dump -U quizuser quiz_platform > $BACKUP_DIR/quiz_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "quiz_*.sql" -mtime +7 -delete
EOF

chmod +x /home/user/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/user/backup-db.sh
```

## 🔍 Troubleshooting

### Check Application Logs
```bash
pm2 logs quiz-api --lines 100
```

### Check Database Connection
```bash
npx prisma studio
```

### Restart Application
```bash
pm2 restart quiz-api
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

## 📈 Performance Optimization

1. **Enable compression**
```bash
npm install compression
```

```typescript
import compression from 'compression';
app.use(compression());
```

2. **Database connection pooling**
Already configured in Prisma

3. **Caching** (Redis)
```bash
npm install @nestjs/cache-manager cache-manager
```

4. **Load balancing**
Use PM2 cluster mode:
```bash
pm2 start dist/main.js -i max --name quiz-api
```

## ✅ Post-Deployment Checklist

- [ ] Application is running
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] Monitoring is active
- [ ] Backups are configured
- [ ] Health check endpoint works
- [ ] WebSocket connections work
- [ ] API documentation accessible
- [ ] Telegram notifications work
- [ ] Error logging configured

## 🆘 Support

For issues:
1. Check application logs
2. Verify environment variables
3. Test database connection
4. Review Nginx configuration
5. Check firewall rules

---

**Remember:** Always test in staging before deploying to production!
