# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or use Docker)
- npm

## Installation (5 minutes)

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start PostgreSQL
**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d
```

**Option B: Using Local PostgreSQL**
Make sure PostgreSQL is running and update `.env` with your credentials.

### 3. Setup Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed test data
# This is optional, only for testing
npm run prisma:seed
```

### 4. Start the Server
```bash
npm run start:dev
```

## 🎯 Access the Application

- **API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api
- **WebSocket:** ws://localhost:3000

## 🧪 Test with Seed Data

### Teacher Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+998901234567",
    "password": "password123"
  }'
```

### Student Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+998900000001",
    "password": "password123"
  }'
```

### Join Quiz by Code
```bash
# First, create a student user or use existing one
# Then join quiz with code: 123456

curl -X POST http://localhost:3000/quizzes/join \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456",
    "userId": "your-user-id"
  }'
```

## 🔌 WebSocket Testing

You can test WebSocket connections using a tool like [Postman](https://www.postman.com/) or [Socket.IO Client](https://socket.io/docs/v4/client-api/).

### Connect to WebSocket
```javascript
const socket = io('http://localhost:3000');

// Join a quiz
socket.emit('joinQuiz', {
  quizId: 'quiz-uuid',
  userId: 'user-uuid',
  userName: 'Test User'
});

// Listen for events
socket.on('quizStarted', (data) => {
  console.log('Quiz started:', data);
});

socket.on('newQuestion', (data) => {
  console.log('New question:', data);
});

socket.on('leaderboardUpdate', (data) => {
  console.log('Leaderboard:', data);
});
```

## 📱 Telegram Setup (Optional)

1. Create a bot: https://t.me/botfather
2. Get bot token
3. Update `.env`:
   ```env
   TELEGRAM_BOT_TOKEN="your-bot-token"
   ```
4. Get your Telegram ID: https://t.me/userinfobot
5. Update teacher's telegramId in database or register with it

## 🛠️ Common Commands

```bash
# View database in Prisma Studio
npm run prisma:studio

# Reset database
npx prisma migrate reset

# View logs
docker-compose logs -f postgres

# Stop all services
docker-compose down
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Change PORT in .env file
PORT=3001
```

### Database connection error
```bash
# Check PostgreSQL is running
docker-compose ps

# Check DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quiz_platform?schema=public"
```

### Prisma Client not generated
```bash
npm run prisma:generate
```

## 📚 Next Steps

1. Explore the Swagger documentation at http://localhost:3000/api
2. Test the REST API endpoints
3. Connect a WebSocket client to test real-time features
4. Create your own quizzes and questions
5. Invite students to join and test the full flow

## 🎓 Example Quiz Flow

1. **Teacher creates a quiz** (POST /quizzes)
2. **Teacher adds questions** (POST /questions)
3. **Teacher starts the quiz** (POST /quizzes/:id/start)
4. **Students join by code** (POST /quizzes/join)
5. **WebSocket broadcasts questions** automatically
6. **Students submit answers** (POST /answers)
7. **Leaderboard updates** in real-time
8. **Teacher completes quiz** (POST /quizzes/:id/complete)
9. **Telegram notification sent** to teacher with results

Enjoy building with the Quiz Platform! 🎉
