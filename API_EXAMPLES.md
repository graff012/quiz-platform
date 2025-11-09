# 📡 API Examples

complete examples for testing all endpoints.

## 🔐 Authentication

### Register Teacher
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Teacher",
    "phoneNumber": "+998901111111",
    "password": "password123",
    "role": "TEACHER",
    "telegramId": "123456789"
  }'
```

### Register Student
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Bob",
    "lastName": "Student",
    "phoneNumber": "+998902222222",
    "password": "password123",
    "role": "STUDENT"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+998901234567",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Teacher",
    "phoneNumber": "+998901234567",
    "role": "TEACHER"
  }
}
```

## 📝 Quiz Management

### Create Quiz (Teacher)
```bash
curl -X POST http://localhost:3000/quizzes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "JavaScript Advanced Quiz",
    "type": "INDIVIDUAL",
    "defaultQuestionTime": 20
  }'
```

### Get All Quizzes
```bash
curl -X GET http://localhost:3000/quizzes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Quiz by ID
```bash
curl -X GET http://localhost:3000/quizzes/QUIZ_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Quiz by Code (Public)
```bash
curl -X GET http://localhost:3000/quizzes/code/123456
```

### Update Quiz
```bash
curl -X PATCH http://localhost:3000/quizzes/QUIZ_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Updated Quiz Title",
    "defaultQuestionTime": 25
  }'
```

### Start Quiz
```bash
curl -X POST http://localhost:3000/quizzes/QUIZ_ID/start \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Complete Quiz
```bash
curl -X POST http://localhost:3000/quizzes/QUIZ_ID/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Join Quiz (Student)
```bash
curl -X POST http://localhost:3000/quizzes/join \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456",
    "userId": "USER_ID"
  }'
```

### Get Leaderboard
```bash
curl -X GET http://localhost:3000/quizzes/QUIZ_ID/leaderboard
```

## ❓ Question Management

### Create Question with Options (Teacher)
```bash
curl -X POST http://localhost:3000/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quizId": "QUIZ_ID",
    "text": "What is the output of: console.log(typeof [])?",
    "order": 1,
    "timeLimit": 15,
    "options": [
      {
        "text": "array",
        "label": "A",
        "isCorrect": false
      },
      {
        "text": "object",
        "label": "B",
        "isCorrect": true
      },
      {
        "text": "undefined",
        "label": "C",
        "isCorrect": false
      },
      {
        "text": "null",
        "label": "D",
        "isCorrect": false
      }
    ]
  }'
```

### Get All Questions
```bash
curl -X GET http://localhost:3000/questions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Questions by Quiz
```bash
curl -X GET "http://localhost:3000/questions?quizId=QUIZ_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Question
```bash
curl -X PATCH http://localhost:3000/questions/QUESTION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "text": "Updated question text",
    "timeLimit": 20
  }'
```

### Delete Question
```bash
curl -X DELETE http://localhost:3000/questions/QUESTION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ Answer Submission

### Submit Answer (Student)
```bash
curl -X POST http://localhost:3000/answers \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "QUESTION_ID",
    "userId": "USER_ID",
    "optionId": "OPTION_ID"
  }'
```

### Get All Answers
```bash
curl -X GET http://localhost:3000/answers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Answers by Question
```bash
curl -X GET "http://localhost:3000/answers?questionId=QUESTION_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Answers by User
```bash
curl -X GET "http://localhost:3000/answers?userId=USER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Question Statistics
```bash
curl -X GET http://localhost:3000/answers/stats/QUESTION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "questionId": "uuid",
  "totalAnswers": 25,
  "correctAnswers": 18,
  "incorrectAnswers": 7,
  "accuracy": 72,
  "optionStats": [
    {
      "optionId": "uuid",
      "label": "A",
      "text": "Paris",
      "isCorrect": true,
      "selectedCount": 18,
      "percentage": 72
    },
    {
      "optionId": "uuid",
      "label": "B",
      "text": "London",
      "isCorrect": false,
      "selectedCount": 5,
      "percentage": 20
    }
  ]
}
```

## 👥 Team Management

### Create Team (Teacher)
```bash
curl -X POST http://localhost:3000/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quizId": "QUIZ_ID",
    "name": "Team Awesome"
  }'
```

### Get All Teams
```bash
curl -X GET http://localhost:3000/teams \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Teams by Quiz
```bash
curl -X GET "http://localhost:3000/teams?quizId=QUIZ_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add Member to Team
```bash
curl -X POST http://localhost:3000/teams/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "teamId": "TEAM_ID",
    "userId": "USER_ID"
  }'
```

### Remove Member from Team
```bash
curl -X DELETE http://localhost:3000/teams/TEAM_ID/members/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 👤 User Management

### Get All Users
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get User by ID
```bash
curl -X GET http://localhost:3000/users/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update User
```bash
curl -X PATCH http://localhost:3000/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

## 🔌 WebSocket Events

### JavaScript Client Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Join Quiz
socket.emit('joinQuiz', {
  quizId: 'quiz-uuid',
  userId: 'user-uuid',
  userName: 'John Doe'
});

// Start Quiz (Teacher only)
socket.emit('startQuiz', {
  quizId: 'quiz-uuid'
});

// Submit Answer
socket.emit('submitAnswer', {
  questionId: 'question-uuid',
  userId: 'user-uuid',
  optionId: 'option-uuid',
  quizId: 'quiz-uuid'
});

// Complete Quiz (Teacher only)
socket.emit('completeQuiz', {
  quizId: 'quiz-uuid'
});

// Get Leaderboard
socket.emit('getLeaderboard', {
  quizId: 'quiz-uuid'
});

// Listen for events
socket.on('participantJoined', (data) => {
  console.log('New participant:', data);
});

socket.on('quizStarted', (data) => {
  console.log('Quiz started:', data);
});

socket.on('newQuestion', (data) => {
  console.log('New question:', data);
  // data.question contains: id, text, order, timeLimit, options
});

socket.on('questionResults', (data) => {
  console.log('Question results:', data);
  // data contains: questionId, stats, correctOption
});

socket.on('leaderboardUpdate', (data) => {
  console.log('Leaderboard updated:', data);
});

socket.on('quizCompleted', (data) => {
  console.log('Quiz completed:', data);
});
```

### Python Client Example

```python
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Connected to server')
    sio.emit('joinQuiz', {
        'quizId': 'quiz-uuid',
        'userId': 'user-uuid',
        'userName': 'John Doe'
    })

@sio.on('newQuestion')
def on_new_question(data):
    print('New question:', data)

@sio.on('leaderboardUpdate')
def on_leaderboard_update(data):
    print('Leaderboard:', data)

sio.connect('http://localhost:3000')
sio.wait()
```

## 🧪 Complete Quiz Flow Example

```bash
# 1. Teacher logs in
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+998901234567", "password": "password123"}' \
  | jq -r '.access_token')

# 2. Teacher creates a quiz
QUIZ_ID=$(curl -s -X POST http://localhost:3000/quizzes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Test Quiz", "type": "INDIVIDUAL", "defaultQuestionTime": 15}' \
  | jq -r '.id')

# 3. Teacher adds a question
QUESTION_ID=$(curl -s -X POST http://localhost:3000/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"quizId\": \"$QUIZ_ID\",
    \"text\": \"What is 2+2?\",
    \"order\": 1,
    \"timeLimit\": 10,
    \"options\": [
      {\"text\": \"3\", \"label\": \"A\", \"isCorrect\": false},
      {\"text\": \"4\", \"label\": \"B\", \"isCorrect\": true},
      {\"text\": \"5\", \"label\": \"C\", \"isCorrect\": false}
    ]
  }" | jq -r '.id')

# 4. Get quiz code
QUIZ_CODE=$(curl -s -X GET http://localhost:3000/quizzes/$QUIZ_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.code')

echo "Quiz Code: $QUIZ_CODE"

# 5. Student joins (using seed student)
curl -X POST http://localhost:3000/quizzes/join \
  -H "Content-Type: application/json" \
  -d "{\"code\": \"$QUIZ_CODE\", \"userId\": \"STUDENT_USER_ID\"}"

# 6. Teacher starts quiz
curl -X POST http://localhost:3000/quizzes/$QUIZ_ID/start \
  -H "Authorization: Bearer $TOKEN"

# 7. View leaderboard
curl -X GET http://localhost:3000/quizzes/$QUIZ_ID/leaderboard
```

## 📊 Response Examples

### Successful Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Teacher",
    "phoneNumber": "+998901234567",
    "role": "TEACHER",
    "telegramId": "123456789",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Quiz Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "JavaScript Basics Quiz",
  "code": "123456",
  "type": "INDIVIDUAL",
  "status": "DRAFT",
  "teacherId": "teacher-uuid",
  "defaultQuestionTime": 15,
  "totalTime": null,
  "startedAt": null,
  "completedAt": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "teacher": {
    "id": "teacher-uuid",
    "firstName": "John",
    "lastName": "Teacher",
    "phoneNumber": "+998901234567"
  },
  "questions": [],
  "participants": [],
  "teams": []
}
```

### Leaderboard Response
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
      "joinedAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "user-uuid",
        "firstName": "Alice",
        "lastName": "Student"
      }
    }
  ]
}
```

## 🔍 Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Quiz with ID xyz not found"
}
```

### 400 Bad Request
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

---

**Tip:** Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to import these examples and test the API easily!
