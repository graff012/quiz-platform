# Live Quiz App

A real-time quiz application built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **React** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router DOM v6** - Routing
- **Tailwind CSS** - Styling

## Project Structure

```
src/
├── components/     # Reusable components
├── layouts/        # Layout components (TeacherLayout, StudentLayout)
├── pages/          # Page components
│   ├── teacher/    # Teacher-specific pages
│   └── student/    # Student-specific pages
├── routes/         # React Router configuration
├── types/          # TypeScript type definitions
├── lib/            # Utility functions and API calls
├── App.tsx         # Main app component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Routes

### Teacher Routes
- `/teacher/login` - Teacher login
- `/teacher/dashboard` - Quiz list and management
- `/teacher/quiz/create` - Create new quiz (select Yakka/Jamoaviy)
- `/teacher/quiz/:id/build` - Add questions and options
- `/teacher/quiz/:id/lobby` - Pre-start lobby (shows code, participants)
- `/teacher/quiz/:id/results` - View results and leaderboard
- `/teacher/profile` - Teacher profile
- `/teacher/students` - Students list
- `/teacher/archive` - Archived quizzes

### Student Routes
- `/` - Landing page (enter quiz code)
- `/student/quiz/:code/join` - Enter name to join
- `/student/quiz/:id/lobby` - Waiting room
- `/student/quiz/:id/question/:questionId` - Answer questions
- `/student/quiz/:id/results` - Final results

## Quiz Types

- **Yakka** - Individual quiz
- **Jamoaviy** - Team/group quiz

## Development Notes

- Dark theme is configured in `tailwind.config.js`
- TypeScript types are defined in `src/types/index.ts`
- API utilities should be added to `src/lib/api.ts`
- All page components are scaffolded with basic headings
