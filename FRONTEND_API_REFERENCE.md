# 🚀 Frontend API Reference

Complete API documentation for frontend integration with the Quiz Application backend.

**Base URL:** `http://localhost:3000`

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Quizzes](#quizzes)
- [Questions](#questions)
- [Answers](#answers)
- [Teams](#teams)
- [WebSocket Events](#websocket-events)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)

---

## 🔐 Authentication

### Register User

**Endpoint:** `POST /auth/register`

**Auth Required:** No

**Request Body:**
```typescript
{
  firstName?: string;        // Optional
  lastName?: string;         // Optional
  phoneNumber: string;       // Required, e.g., "+998901234567"
  password: string;          // Required, min 6 characters
  role?: "TEACHER" | "STUDENT";  // Optional, default: "STUDENT"
  telegramId?: string;       // Optional
}
```

**Success Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+998901234567",
    "role": "TEACHER",
    "telegramId": "123456789",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+998901234567',
    password: 'password123',
    role: 'TEACHER'
  })
});
const data = await response.json();
```

---

### Login

**Endpoint:** `POST /auth/login`

**Auth Required:** No

**Request Body:**
```typescript
{
  phoneNumber: string;  // Required
  password: string;     // Required
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+998901234567",
    "role": "TEACHER"
  }
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+998901234567',
    password: 'password123'
  })
});
const data = await response.json();
localStorage.setItem('token', data.access_token);
```

---

## 👤 Users

### Get All Users

**Endpoint:** `GET /users`

**Auth Required:** Yes (Bearer Token)

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+998901234567",
    "role": "TEACHER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const users = await response.json();
```

---

### Get User by ID

**Endpoint:** `GET /users/:id`

**Auth Required:** Yes

**URL Parameters:**
- `id` (string) - User UUID

**Success Response (200):**
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+998901234567",
  "role": "TEACHER"
}
```

---

### Update User

**Endpoint:** `PATCH /users/:id`

**Auth Required:** Yes

**Request Body:**
```typescript
{
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  password?: string;
}
```

**Success Response (200):** Updated user object

---

### Delete User

**Endpoint:** `DELETE /users/:id`

**Auth Required:** Yes

**Success Response (200):** Deleted user object

---

## 📝 Quizzes

### Create Quiz (Teacher Only)

**Endpoint:** `POST /quizzes`

**Auth Required:** Yes (Teacher role)

**Request Body:**
```typescript
{
  title: string;                    // Required
  type?: "INDIVIDUAL" | "TEAM";     // Optional, default: "INDIVIDUAL"
  defaultQuestionTime?: number;     // Optional, min: 5 seconds
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "title": "JavaScript Basics Quiz",
  "code": "123456",
  "type": "INDIVIDUAL",
  "status": "DRAFT",
  "teacherId": "teacher-uuid",
  "defaultQuestionTime": 15,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/quizzes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'JavaScript Advanced Quiz',
    type: 'INDIVIDUAL',
    defaultQuestionTime: 20
  })
});
const quiz = await response.json();
```

---

### Get All Quizzes

**Endpoint:** `GET /quizzes`

**Auth Required:** Yes

**Query Parameters:**
- `teacherId` (string, optional) - Filter by teacher ID

**Success Response (200):** Array of quiz objects

**Example:**
```javascript
// Get all quizzes
const response = await fetch('http://localhost:3000/quizzes', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Get quizzes by teacher
const response = await fetch('http://localhost:3000/quizzes?teacherId=uuid', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### Get Quiz by ID

**Endpoint:** `GET /quizzes/:id`

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "id": "uuid",
  "title": "JavaScript Basics Quiz",
  "code": "123456",
  "type": "INDIVIDUAL",
  "status": "DRAFT",
  "teacherId": "teacher-uuid",
  "defaultQuestionTime": 15,
  "teacher": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Teacher"
  },
  "questions": [],
  "participants": [],
  "teams": []
}
```

---

### Get Quiz by Code (Public)

**Endpoint:** `GET /quizzes/code/:code`

**Auth Required:** No

**URL Parameters:**
- `code` (string) - 6-digit quiz code

**Success Response (200):** Quiz object

**Example:**
```javascript
const response = await fetch('http://localhost:3000/quizzes/code/123456');
const quiz = await response.json();
```

---

### Update Quiz (Teacher Only)

**Endpoint:** `PATCH /quizzes/:id`

**Auth Required:** Yes (Teacher role)

**Request Body:**
```typescript
{
  title?: string;
  type?: "INDIVIDUAL" | "TEAM";
  defaultQuestionTime?: number;
}
```

**Success Response (200):** Updated quiz object

---

### Delete Quiz (Teacher Only)

**Endpoint:** `DELETE /quizzes/:id`

**Auth Required:** Yes (Teacher role)

**Success Response (200):** Deleted quiz object

---

### Start Quiz (Teacher Only)

**Endpoint:** `POST /quizzes/:id/start`

**Auth Required:** Yes (Teacher role)

**Success Response (200):**
```json
{
  "id": "uuid",
  "status": "IN_PROGRESS",
  "startedAt": "2024-01-01T10:00:00.000Z"
}
```

**Example:**
```javascript
const response = await fetch(`http://localhost:3000/quizzes/${quizId}/start`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### Complete Quiz (Teacher Only)

**Endpoint:** `POST /quizzes/:id/complete`

**Auth Required:** Yes (Teacher role)

**Success Response (200):**
```json
{
  "id": "uuid",
  "status": "COMPLETED",
  "completedAt": "2024-01-01T11:00:00.000Z"
}
```

---

### Join Quiz

**Endpoint:** `POST /quizzes/join`

**Auth Required:** No

**Request Body:**
```typescript
{
  code: string;           // Required, 6-digit quiz code
  name: string;           // Required, student name
  phoneNumber?: string;   // Optional
  teamId?: string;        // Optional, for team quizzes
}
```

**Success Response (201):**
```json
{
  "id": "participant-uuid",
  "quizId": "quiz-uuid",
  "userId": "user-uuid",
  "teamId": null,
  "score": 0,
  "joinedAt": "2024-01-01T10:00:00.000Z",
  "user": {
    "id": "user-uuid",
    "firstName": "John",
    "lastName": "Student"
  }
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/quizzes/join', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: '123456',
    name: 'John Student',
    phoneNumber: '+998901234567'
  })
});
const participant = await response.json();
```

---

### Get Leaderboard

**Endpoint:** `GET /quizzes/:id/leaderboard`

**Auth Required:** No

**Success Response (200):**
```json
{
  "quizId": "quiz-uuid",
  "quizTitle": "JavaScript Basics Quiz",
  "participants": [
    {
      "id": "participant-uuid",
      "quizId": "quiz-uuid",
      "userId": "user-uuid",
      "teamId": null,
      "score": 5,
      "joinedAt": "2024-01-01T10:00:00.000Z",
      "user": {
        "id": "user-uuid",
        "firstName": "Alice",
        "lastName": "Student"
      }
    }
  ]
}
```

**Example:**
```javascript
const response = await fetch(`http://localhost:3000/quizzes/${quizId}/leaderboard`);
const leaderboard = await response.json();
```

---

## ❓ Questions

### Create Question (Teacher Only)

**Endpoint:** `POST /questions`

**Auth Required:** Yes (Teacher role)

**Request Body:**
```typescript
{
  quizId: string;        // Required, UUID
  text: string;          // Required, question text
  order: number;         // Required, min: 1
  timeLimit: number;     // Required, min: 5 seconds
  options: [             // Required, min: 2 options
    {
      text: string;      // Required
      label: string;     // Required, e.g., "A", "B", "C", "D"
      isCorrect: boolean // Required
    }
  ]
}
```

**Success Response (201):**
```json
{
  "id": "question-uuid",
  "quizId": "quiz-uuid",
  "text": "What is the capital of France?",
  "order": 1,
  "timeLimit": 15,
  "options": [
    {
      "id": "option-uuid",
      "text": "Paris",
      "label": "A",
      "isCorrect": true
    },
    {
      "id": "option-uuid",
      "text": "London",
      "label": "B",
      "isCorrect": false
    }
  ]
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/questions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    quizId: 'quiz-uuid',
    text: 'What is 2 + 2?',
    order: 1,
    timeLimit: 10,
    options: [
      { text: '3', label: 'A', isCorrect: false },
      { text: '4', label: 'B', isCorrect: true },
      { text: '5', label: 'C', isCorrect: false }
    ]
  })
});
```

---

### Get All Questions

**Endpoint:** `GET /questions`

**Auth Required:** Yes (Teacher role)

**Query Parameters:**
- `quizId` (string, optional) - Filter by quiz ID

**Success Response (200):** Array of question objects

**Example:**
```javascript
// Get all questions for a quiz
const response = await fetch(`http://localhost:3000/questions?quizId=${quizId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### Get Question by ID

**Endpoint:** `GET /questions/:id`

**Auth Required:** Yes (Teacher role)

**Success Response (200):** Question object with options

---

### Update Question (Teacher Only)

**Endpoint:** `PATCH /questions/:id`

**Auth Required:** Yes (Teacher role)

**Request Body:**
```typescript
{
  text?: string;
  order?: number;
  timeLimit?: number;
}
```

**Success Response (200):** Updated question object

---

### Delete Question (Teacher Only)

**Endpoint:** `DELETE /questions/:id`

**Auth Required:** Yes (Teacher role)

**Success Response (200):** Deleted question object

---

## ✅ Answers

### Submit Answer

**Endpoint:** `POST /answers`

**Auth Required:** No

**Request Body:**
```typescript
{
  questionId: string;  // Required, UUID
  userId: string;      // Required, UUID
  optionId: string;    // Required, UUID
}
```

**Success Response (201):**
```json
{
  "id": "answer-uuid",
  "questionId": "question-uuid",
  "userId": "user-uuid",
  "optionId": "option-uuid",
  "isCorrect": true,
  "answeredAt": "2024-01-01T10:05:00.000Z"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/answers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    questionId: 'question-uuid',
    userId: 'user-uuid',
    optionId: 'option-uuid'
  })
});
```

---

### Get All Answers

**Endpoint:** `GET /answers`

**Auth Required:** Yes

**Query Parameters:**
- `questionId` (string, optional) - Filter by question ID
- `userId` (string, optional) - Filter by user ID

**Success Response (200):** Array of answer objects

**Example:**
```javascript
// Get answers for a specific question
const response = await fetch(`http://localhost:3000/answers?questionId=${questionId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Get answers by a specific user
const response = await fetch(`http://localhost:3000/answers?userId=${userId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### Get Answer by ID

**Endpoint:** `GET /answers/:id`

**Auth Required:** Yes

**Success Response (200):** Answer object

---

### Get Question Statistics

**Endpoint:** `GET /answers/stats/:questionId`

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "questionId": "question-uuid",
  "totalAnswers": 25,
  "correctAnswers": 18,
  "incorrectAnswers": 7,
  "accuracy": 72,
  "optionStats": [
    {
      "optionId": "option-uuid",
      "label": "A",
      "text": "Paris",
      "isCorrect": true,
      "selectedCount": 18,
      "percentage": 72
    },
    {
      "optionId": "option-uuid",
      "label": "B",
      "text": "London",
      "isCorrect": false,
      "selectedCount": 5,
      "percentage": 20
    }
  ]
}
```

**Example:**
```javascript
const response = await fetch(`http://localhost:3000/answers/stats/${questionId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const stats = await response.json();
```

---

## 👥 Teams

### Create Team (Teacher Only)

**Endpoint:** `POST /teams`

**Auth Required:** Yes (Teacher role)

**Request Body:**
```typescript
{
  quizId: string;  // Required, UUID
  name: string;    // Required
}
```

**Success Response (201):**
```json
{
  "id": "team-uuid",
  "quizId": "quiz-uuid",
  "name": "Team Alpha",
  "score": 0,
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/teams', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    quizId: 'quiz-uuid',
    name: 'Team Awesome'
  })
});
```

---

### Get All Teams

**Endpoint:** `GET /teams`

**Auth Required:** Yes

**Query Parameters:**
- `quizId` (string, optional) - Filter by quiz ID

**Success Response (200):** Array of team objects

**Example:**
```javascript
const response = await fetch(`http://localhost:3000/teams?quizId=${quizId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### Get Team by ID

**Endpoint:** `GET /teams/:id`

**Auth Required:** Yes

**Success Response (200):** Team object with members

---

### Update Team (Teacher Only)

**Endpoint:** `PATCH /teams/:id`

**Auth Required:** Yes (Teacher role)

**Request Body:**
```typescript
{
  name?: string;
}
```

**Success Response (200):** Updated team object

---

### Delete Team (Teacher Only)

**Endpoint:** `DELETE /teams/:id`

**Auth Required:** Yes (Teacher role)

**Success Response (200):** Deleted team object

---

### Add Member to Team

**Endpoint:** `POST /teams/members`

**Auth Required:** Yes

**Request Body:**
```typescript
{
  teamId: string;  // Required, UUID
  userId: string;  // Required, UUID
}
```

**Success Response (201):** Updated participant object

**Example:**
```javascript
const response = await fetch('http://localhost:3000/teams/members', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    teamId: 'team-uuid',
    userId: 'user-uuid'
  })
});
```

---

### Remove Member from Team

**Endpoint:** `DELETE /teams/:teamId/members/:userId`

**Auth Required:** Yes

**Success Response (200):** Updated participant object

**Example:**
```javascript
const response = await fetch(`http://localhost:3000/teams/${teamId}/members/${userId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🔌 WebSocket Events

**Connection URL:** `ws://localhost:3000`

### Client → Server Events

#### Join Quiz
```javascript
socket.emit('joinQuiz', {
  quizId: 'quiz-uuid',
  userId: 'user-uuid',
  userName: 'John Doe'
});
```

#### Start Quiz (Teacher Only)
```javascript
socket.emit('startQuiz', {
  quizId: 'quiz-uuid'
});
```

#### Submit Answer
```javascript
socket.emit('submitAnswer', {
  questionId: 'question-uuid',
  userId: 'user-uuid',
  optionId: 'option-uuid',
  quizId: 'quiz-uuid'
});
```

#### Complete Quiz (Teacher Only)
```javascript
socket.emit('completeQuiz', {
  quizId: 'quiz-uuid'
});
```

#### Get Leaderboard
```javascript
socket.emit('getLeaderboard', {
  quizId: 'quiz-uuid'
});
```

---

### Server → Client Events

#### Participant Joined
```javascript
socket.on('participantJoined', (data) => {
  // data: { userId, userName, quizId }
  console.log('New participant:', data);
});
```

#### Quiz Started
```javascript
socket.on('quizStarted', (data) => {
  // data: { quizId, startedAt }
  console.log('Quiz started:', data);
});
```

#### New Question
```javascript
socket.on('newQuestion', (data) => {
  // data: { question: { id, text, order, timeLimit, options } }
  console.log('New question:', data);
});
```

#### Question Results
```javascript
socket.on('questionResults', (data) => {
  // data: { questionId, stats, correctOption }
  console.log('Question results:', data);
});
```

#### Leaderboard Update
```javascript
socket.on('leaderboardUpdate', (data) => {
  // data: { participants: [...] }
  console.log('Leaderboard updated:', data);
});
```

#### Quiz Completed
```javascript
socket.on('quizCompleted', (data) => {
  // data: { quizId, completedAt }
  console.log('Quiz completed:', data);
});
```

---

### Complete WebSocket Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Connection established
socket.on('connect', () => {
  console.log('Connected to server');
  
  // Join quiz
  socket.emit('joinQuiz', {
    quizId: 'quiz-uuid',
    userId: 'user-uuid',
    userName: 'John Doe'
  });
});

// Listen for events
socket.on('participantJoined', (data) => {
  console.log('New participant:', data);
});

socket.on('quizStarted', (data) => {
  console.log('Quiz started:', data);
});

socket.on('newQuestion', (data) => {
  console.log('New question:', data.question);
  // Display question to user
});

socket.on('questionResults', (data) => {
  console.log('Results:', data);
  // Show correct answer and statistics
});

socket.on('leaderboardUpdate', (data) => {
  console.log('Leaderboard:', data.participants);
  // Update leaderboard UI
});

socket.on('quizCompleted', (data) => {
  console.log('Quiz completed:', data);
  // Show final results
});

// Disconnect
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

---

## 📊 Response Formats

### Success Response Structure
All successful responses return the requested data directly or wrapped in an object.

### Pagination
Currently, the API does not implement pagination. All list endpoints return complete arrays.

### Timestamps
All timestamps are in ISO 8601 format: `2024-01-01T10:00:00.000Z`

### UUIDs
All IDs are UUID v4 format: `550e8400-e29b-41d4-a716-446655440000`

---

## ❌ Error Handling

### Error Response Structure
```json
{
  "statusCode": 400,
  "message": "Error message or array of validation errors",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

#### 400 Bad Request
Invalid request body or parameters.
```json
{
  "statusCode": 400,
  "message": [
    "phoneNumber should not be empty",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

#### 401 Unauthorized
Missing or invalid authentication token.
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 403 Forbidden
Insufficient permissions (e.g., student trying to access teacher-only endpoint).
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

#### 404 Not Found
Resource not found.
```json
{
  "statusCode": 404,
  "message": "Quiz with ID xyz not found"
}
```

#### 409 Conflict
Resource conflict (e.g., duplicate phone number).
```json
{
  "statusCode": 409,
  "message": "User with this phone number already exists"
}
```

#### 500 Internal Server Error
Server error.
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 🔒 Authentication

Most endpoints require authentication using JWT Bearer tokens.

### How to Authenticate

1. **Login or Register** to get an access token
2. **Include the token** in the `Authorization` header for protected endpoints

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3000/quizzes', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Token Storage
Store the JWT token securely:
- **Web:** `localStorage` or `sessionStorage`
- **Mobile:** Secure storage (e.g., Keychain, Keystore)

### Token Expiration
Tokens may expire. Handle 401 responses by redirecting to login.

---

## 🎯 Quick Start Example

### Complete Flow: Teacher Creates Quiz

```javascript
// 1. Login as teacher
const loginRes = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+998901234567',
    password: 'password123'
  })
});
const { access_token } = await loginRes.json();

// 2. Create quiz
const quizRes = await fetch('http://localhost:3000/quizzes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    title: 'JavaScript Quiz',
    type: 'INDIVIDUAL',
    defaultQuestionTime: 15
  })
});
const quiz = await quizRes.json();

// 3. Add question
const questionRes = await fetch('http://localhost:3000/questions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    quizId: quiz.id,
    text: 'What is 2 + 2?',
    order: 1,
    timeLimit: 10,
    options: [
      { text: '3', label: 'A', isCorrect: false },
      { text: '4', label: 'B', isCorrect: true },
      { text: '5', label: 'C', isCorrect: false }
    ]
  })
});

// 4. Start quiz
await fetch(`http://localhost:3000/quizzes/${quiz.id}/start`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${access_token}` }
});

console.log('Quiz code:', quiz.code);
```

### Complete Flow: Student Joins Quiz

```javascript
// 1. Get quiz by code (no auth needed)
const quizRes = await fetch('http://localhost:3000/quizzes/code/123456');
const quiz = await quizRes.json();

// 2. Join quiz
const joinRes = await fetch('http://localhost:3000/quizzes/join', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: '123456',
    name: 'John Student',
    phoneNumber: '+998901234567'
  })
});
const participant = await joinRes.json();

// 3. Connect to WebSocket
const socket = io('http://localhost:3000');
socket.emit('joinQuiz', {
  quizId: quiz.id,
  userId: participant.userId,
  userName: 'John Student'
});

// 4. Listen for questions and submit answers
socket.on('newQuestion', (data) => {
  // Display question
  // When user selects answer:
  socket.emit('submitAnswer', {
    questionId: data.question.id,
    userId: participant.userId,
    optionId: selectedOptionId,
    quizId: quiz.id
  });
});
```

---

## 📚 Additional Resources

- **Postman Collection:** See `POSTMAN_GUIDE.md`
- **WebSocket Details:** See `WEBSOCKET_GUIDE.md`
- **Deployment Guide:** See `DEPLOYMENT.md`
- **Project Summary:** See `PROJECT_SUMMARY.md`

---

**Last Updated:** 2024-11-08
