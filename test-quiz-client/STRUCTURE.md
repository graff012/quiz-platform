# Project Structure

```
test-quiz-client/
├── public/
├── src/
│   ├── components/          # Reusable UI components (empty - add as needed)
│   ├── layouts/
│   │   ├── TeacherLayout.tsx    # Layout with sidebar for teacher pages
│   │   └── StudentLayout.tsx    # Simple layout for student pages
│   ├── lib/
│   │   └── api.ts              # API utility functions
│   ├── pages/
│   │   ├── Landing.tsx         # Home page (/)
│   │   ├── teacher/
│   │   │   ├── Login.tsx       # /teacher/login
│   │   │   ├── Dashboard.tsx   # /teacher/dashboard
│   │   │   ├── QuizCreate.tsx  # /teacher/quiz/create
│   │   │   ├── QuizBuild.tsx   # /teacher/quiz/:id/build
│   │   │   ├── QuizLobby.tsx   # /teacher/quiz/:id/lobby
│   │   │   ├── QuizResults.tsx # /teacher/quiz/:id/results
│   │   │   ├── Profile.tsx     # /teacher/profile
│   │   │   ├── Students.tsx    # /teacher/students
│   │   │   └── Archive.tsx     # /teacher/archive
│   │   └── student/
│   │       ├── Join.tsx        # /student/quiz/:code/join
│   │       ├── Lobby.tsx       # /student/quiz/:id/lobby
│   │       ├── Question.tsx    # /student/quiz/:id/question/:questionId
│   │       └── Results.tsx     # /student/quiz/:id/results
│   ├── routes/
│   │   └── index.tsx           # React Router configuration
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles with Tailwind
│   └── vite-env.d.ts           # Vite environment types
├── .env.example                # Environment variables template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js          # Tailwind with dark theme
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Key Files

### Types (`src/types/index.ts`)
- `User` - User with role (teacher/student)
- `Quiz` - Quiz with type (yakka/jamoaviy) and status
- `Question` - Question with options
- `Option` - Answer option with correctness flag
- `Participant` - Student participating in quiz
- `Answer` - Student's answer with timing

### Routes (`src/routes/index.tsx`)
All routes are configured with nested layouts:
- Teacher routes use `TeacherLayout` (with sidebar)
- Student routes use `StudentLayout` (no sidebar)

### Layouts
- **TeacherLayout**: Dark sidebar with navigation (Boshqaruv, O'quvchilar, Arxiv, Profile)
- **StudentLayout**: Minimal wrapper for student pages

### Tailwind Theme
Custom colors configured in `tailwind.config.js`:
- `background`: #000000 (black)
- `card`: #1a1a1a (dark gray)
- `card-hover`: #262626
- `border`: #333333
- `primary`: #3b82f6 (blue)
- `primary-hover`: #2563eb

## Next Steps

1. Run `npm install` to install dependencies
2. Add component implementations in `src/components/`
3. Implement API functions in `src/lib/api.ts`
4. Add WebSocket/real-time logic for live quiz features
5. Fill in page content and logic
