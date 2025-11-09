# 🎯 Quiz Platform Backend

A complete real-time quiz/test platform built with **NestJS**, **Prisma**, **PostgreSQL**, and **WebSockets**.

## 📋 Description

This is a production-ready backend for a live quiz system where teachers can create quizzes, add questions, and conduct real-time quiz sessions. Students can join quizzes by code, answer questions live, and see leaderboards in real-time. The system supports both individual and team-based quizzes, with automatic Telegram notifications for quiz results.

## 🚀 Features

### Teacher Features
- ✅ Register/Login with JWT authentication
- ✅ Create and manage quizzes
- ✅ Add questions with multiple options
- ✅ Start quiz and broadcast questions live
- ✅ View real-time results and leaderboards
- ✅ Receive Telegram notifications with top 3 winners

### Student Features
- ✅ Join quiz by code (no registration required)
- ✅ Enter name and participate
- ✅ See questions live with time limits
- ✅ Submit answers in real-time
- ✅ View live leaderboard and final ranking

### Technical Features
- ✅ Real-time WebSocket communication
- ✅ Individual and team-based quizzes
- ✅ Automatic score calculation
- ✅ Question statistics and analytics
- ✅ Swagger API documentation
- ✅ Full TypeScript support
- ✅ Prisma ORM with PostgreSQL
- ✅ Class-validator DTOs
- ✅ Role-based access control

## 🛠️ Tech Stack

- **Framework:** NestJS 11
- **Database:** PostgreSQL
- **ORM:** Prisma 5
- **Authentication:** JWT + Passport
- **Real-time:** Socket.IO (WebSockets)
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI
- **Notifications:** Telegram Bot API

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd test-quiz-nestjs
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quiz_platform?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
PORT=3000
```

4. **Start PostgreSQL with Docker (optional)**
```bash
docker-compose up -d
```

5. **Generate Prisma Client**
```bash
npm run prisma:generate
```

6. **Run database migrations**
```bash
npm run prisma:migrate
```

7. **Seed the database**
```bash
npm run prisma:seed
```

## 🏃 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The application will be available at:
- **API:** http://localhost:3000
- **Swagger Documentation:** http://localhost:3000/api
- **WebSocket:** ws://localhost:3000

## 📚 API Documentation

Once the application is running, visit http://localhost:3000/api to explore the interactive Swagger documentation.

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

#### Quizzes
- `POST /quizzes` - Create quiz (Teacher)
- `GET /quizzes` - Get all quizzes
- `GET /quizzes/:id` - Get quiz by ID
- `GET /quizzes/code/:code` - Get quiz by code
- `POST /quizzes/:id/start` - Start quiz (Teacher)
- `POST /quizzes/:id/complete` - Complete quiz (Teacher)
- `POST /quizzes/join` - Join quiz by code
- `GET /quizzes/:id/leaderboard` - Get leaderboard

#### Questions
- `POST /questions` - Create question (Teacher)
- `GET /questions` - Get all questions
- `PATCH /questions/:id` - Update question (Teacher)
- `DELETE /questions/:id` - Delete question (Teacher)

#### Answers
- `POST /answers` - Submit answer
- `GET /answers/stats/:questionId` - Get question statistics

#### Teams
- `POST /teams` - Create team (Teacher)
- `POST /teams/members` - Add member to team
- `DELETE /teams/:teamId/members/:userId` - Remove member

## 🔌 WebSocket Events

### Client → Server

**Join Quiz**
```javascript
socket.emit('joinQuiz', {
  quizId: 'quiz-uuid',
  userId: 'user-uuid',
  userName: 'John Doe'
});
```

**Start Quiz (Teacher)**
```javascript
socket.emit('startQuiz', {
  quizId: 'quiz-uuid'
});
```

**Submit Answer**
```javascript
socket.emit('submitAnswer', {
  questionId: 'question-uuid',
  userId: 'user-uuid',
  optionId: 'option-uuid',
  quizId: 'quiz-uuid'
});
```

**Complete Quiz (Teacher)**
```javascript
socket.emit('completeQuiz', {
  quizId: 'quiz-uuid'
});
```

### Server → Client

**Quiz Started**
```javascript
socket.on('quizStarted', (data) => {
  // { quizId, startedAt, firstQuestion }
});
```

**New Question**
```javascript
socket.on('newQuestion', (data) => {
  // { question, questionNumber, totalQuestions, hasNext }
});
```

**Leaderboard Update**
```javascript
socket.on('leaderboardUpdate', (data) => {
  // { quizId, quizTitle, participants }
});
```

**Quiz Completed**
```javascript
socket.on('quizCompleted', (data) => {
  // { quizId, completedAt, leaderboard }
});
```

## 🗄️ Database Schema

The application uses the following main models:

- **User** - Teachers and students
- **Quiz** - Quiz metadata and configuration
- **Question** - Quiz questions
- **Option** - Answer options for questions
- **Answer** - Student answers
- **QuizParticipants** - Quiz participation records
- **Team** - Team information
- **TeamMember** - Team membership

See `prisma/schema.prisma` for the complete schema.

## 🌱 Seed Data

After running `npm run prisma:seed`, you'll have:

**Teacher Account:**
- Phone: `+998901234567`
- Password: `password123`

**Student Accounts:**
- Phone: `+998900000001` to `+998900000005`
- Password: `password123`

**Quiz Codes:**
- Individual Quiz: `123456`
- Team Quiz: `654321`

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📱 Telegram Integration

To enable Telegram notifications:

1. Create a bot using [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Add the token to `.env`:
```env
TELEGRAM_BOT_TOKEN="your-bot-token-here"
```
4. Get your Telegram ID from [@userinfobot](https://t.me/userinfobot)
5. Add your Telegram ID when registering as a teacher

## 🐳 Docker Support

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# View logs
docker-compose logs -f
```

## 📝 Project Structure

```
src/
├── auth/              # Authentication module
├── users/             # User management
├── quizzes/           # Quiz management
├── questions/         # Question management
├── answers/           # Answer submission
├── teams/             # Team management
├── telegram/          # Telegram notifications
├── quiz-gateway/      # WebSocket gateway
├── prisma/            # Prisma service
└── main.ts            # Application entry point
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation with class-validator
- CORS enabled
- Environment variable configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is [MIT licensed](LICENSE).
