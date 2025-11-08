# 🚀 Quick Start Guide

## Your Live Quiz App is Ready!

The development server is already running at: **http://localhost:5173**

## 🎯 Test the App Flow

### As a Student:
1. Open http://localhost:5173
2. Enter a 4-digit code (e.g., "1234")
3. Click "Kirish"
4. Enter your name
5. Wait in lobby for teacher to start

### As a Teacher:
1. Open http://localhost:5173
2. Click "Test yaratish" to register
3. Fill in name, email, and password
4. After registration, you're auto-logged in
5. Click "Yakka" or "Jamoaviy" to create quiz
6. Add questions with options
7. Get 4-digit code in lobby
8. Share code with students
9. Click "BOSHLASH" to start

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Primary/secondary/disabled
│   ├── Input.tsx       # Form input with validation
│   ├── Card.tsx        # Dark card container
│   ├── Timer.tsx       # Countdown timer
│   └── ParticipantList.tsx
├── pages/
│   ├── Landing.tsx     # Home page
│   ├── teacher/        # 10 teacher pages
│   └── student/        # 4 student pages
├── store/
│   └── useQuizStore.ts # Zustand state management
├── lib/
│   ├── api.ts          # Axios API client
│   └── socket.ts       # Socket.io setup
├── hooks/
│   └── useSocket.ts    # WebSocket hook
└── types/
    └── index.ts        # TypeScript types
```

## 🎨 Design Features

### Colors
- **Background**: Pure black (#000000)
- **Cards**: Dark gray (#1a1a1a)
- **Text**: White
- **Primary**: Blue (#3b82f6)

### Components
- **Large buttons** - Easy to click
- **Centered text** - Clean layout
- **Real-time updates** - WebSocket powered
- **Immediate feedback** - Green/red colors
- **Auto-advance** - Smooth flow

## 🔌 Backend Requirements

You need to implement these API endpoints:

### Authentication
```
POST /auth/teacher/register
Body: { name: string, email: string, password: string }
Response: { token: string, user: User }

POST /auth/teacher/login
Body: { email: string, password: string }
Response: { token: string, user: User }
```

### Quiz Management
```
POST /quiz/create
Body: { title: string, type: 'yakka' | 'jamoaviy' }
Response: { id, title, code, type, status }

POST /quiz/:id/questions
Body: { text, order, options: [{ label, text, isCorrect }] }
Response: Question

GET /quiz/code/:code
Response: Quiz

POST /quiz/:id/join
Body: { name: string }
Response: Participant

POST /quiz/:id/start
Response: { success: true }

POST /quiz/:id/answer
Body: { questionId, optionId }
Response: { correct: boolean }

GET /quiz/:id/results
Response: { winner, leaderboard, totalQuestions }
```

### WebSocket Events
```javascript
// Server should emit:
socket.emit('student:joined', participant)
socket.emit('quiz:started')
socket.emit('quiz:next_question', questionIndex)
socket.emit('quiz:ended')

// Server should listen for:
socket.on('join:quiz', (quizId) => {})
socket.on('leave:quiz', (quizId) => {})
```

## 🛠️ Environment Setup

Create `.env` file (already exists):
```
VITE_API_URL=http://localhost:4000
```

Update this to your backend URL.

## 📝 Key Files to Customize

### API Client (`src/lib/api.ts`)
- Update endpoint paths if needed
- Add error handling
- Add request/response interceptors

### WebSocket (`src/lib/socket.ts`)
- Update socket URL
- Add authentication
- Handle reconnection

### Store (`src/store/useQuizStore.ts`)
- Add more state as needed
- Add persistence (localStorage)

## 🎯 Testing Checklist

- [ ] Teacher can login
- [ ] Teacher can create quiz
- [ ] Quiz generates 4-digit code
- [ ] Student can join with code
- [ ] Participants show in real-time
- [ ] Teacher can start quiz
- [ ] Students see questions
- [ ] Timer counts down
- [ ] Answers submit correctly
- [ ] Feedback shows (green/red)
- [ ] Auto-advance works
- [ ] Results display correctly
- [ ] Winner shows on both sides

## 🐛 Troubleshooting

### Port already in use?
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Dependencies issue?
```bash
rm -rf node_modules package-lock.json
npm install --ignore-scripts
```

### TypeScript errors?
The app works despite minor warnings. These are safe to ignore:
- Unused variables
- Import warnings

## 📚 Learn More

- **React Router**: https://reactrouter.com
- **Zustand**: https://github.com/pmndrs/zustand
- **Socket.io**: https://socket.io/docs/v4/
- **Tailwind CSS**: https://tailwindcss.com
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev

## 🎉 You're All Set!

The frontend is complete and ready for backend integration. Open http://localhost:5173 to see it in action!

**Need help?** Check IMPLEMENTATION.md for detailed documentation.
